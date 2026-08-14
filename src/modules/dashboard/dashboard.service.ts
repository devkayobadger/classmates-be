import { listAttendanceRecords } from '../attendance/attendance.repository.js'
import type { AttendanceRecordRow } from '../attendance/attendance.types.js'
import {
  countDistinctEnrolledStudentsForTeacher,
  listEnrollmentsBySubject,
} from '../enrollments/enrollments.repository.js'
import type { EnrollmentWithStudent } from '../enrollments/enrollments.types.js'
import { findSubjectsByTeacher } from '../subjects/subjects.repository.js'
import type { SubjectRecord } from '../subjects/subjects.types.js'
import type {
  DashboardActivityItem,
  DashboardAttentionStudent,
  DashboardClassSession,
  DashboardOverviewResponse,
} from './dashboard.types.js'

const ATTENDANCE_ELIGIBILITY_THRESHOLD = 75

const ordinal = (n: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const remainder = n % 100

  return `${n}${suffixes[(remainder - 20) % 10] ?? suffixes[remainder] ?? suffixes[0]}`
}

const todayDateString = (): string => new Date().toISOString().slice(0, 10)

const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

const percentage = (present: number, total: number): number =>
  total === 0 ? 0 : Math.round((present / total) * 10000) / 100

export const getDashboardOverview = async (
  teacherId: string,
): Promise<DashboardOverviewResponse> => {
  const subjects = await findSubjectsByTeacher(teacherId)
  const today = todayDateString()

  const totalStudents = await countDistinctEnrolledStudentsForTeacher(teacherId)

  const subjectData = await Promise.all(
    subjects.map(async (subject: SubjectRecord) => {
      const [roster, records] = await Promise.all([
        listEnrollmentsBySubject(subject.id),
        listAttendanceRecords({ subjectId: subject.id, teacherId }),
      ])

      return { subject, roster, records }
    }),
  )

  let totalPresent = 0
  let totalRecords = 0
  const todaysClasses: DashboardClassSession[] = []
  const recentRecords: (AttendanceRecordRow & { subject: SubjectRecord; studentName: string })[] =
    []
  const attentionStudents: DashboardAttentionStudent[] = []
  const belowEligibilityStudentIds = new Set<string>()

  for (const { subject, roster, records } of subjectData) {
    totalPresent += records.filter((r) => r.status === 'present').length
    totalRecords += records.length

    const recordsToday = records.filter((r) => r.date === today)
    const status: DashboardClassSession['status'] = recordsToday.length > 0 ? 'recorded' : 'upcoming'

    todaysClasses.push({
      id: subject.id,
      time: '',
      durationMinutes: 0,
      subject: subject.name,
      status,
      studentCount: roster.length,
      program: subject.program || 'N/A',
      semester: `${ordinal(subject.semester)} Sem`,
      room: '',
      recordedPresentCount:
        status === 'recorded'
          ? recordsToday.filter((r) => r.status === 'present').length
          : undefined,
    })

    const studentById = new Map<string, EnrollmentWithStudent['student']>(
      roster.map((enrollment) => [enrollment.studentId, enrollment.student]),
    )

    const recordsByStudent = new Map<string, AttendanceRecordRow[]>()
    for (const record of records) {
      const list = recordsByStudent.get(record.studentId) ?? []
      list.push(record)
      recordsByStudent.set(record.studentId, list)
    }

    for (const [studentId, studentRecords] of recordsByStudent) {
      const student = studentById.get(studentId)
      if (!student) continue

      const present = studentRecords.filter((r) => r.status === 'present').length
      const pct = percentage(present, studentRecords.length)

      if (pct < ATTENDANCE_ELIGIBILITY_THRESHOLD) {
        belowEligibilityStudentIds.add(studentId)

        attentionStudents.push({
          id: student.id,
          name: student.name,
          initials: initialsOf(student.name),
          subject: subject.name,
          semester: `${ordinal(subject.semester)} Sem`,
          attendancePercentage: pct,
        })
      }
    }

    for (const record of records) {
      const student = studentById.get(record.studentId)
      recentRecords.push({ ...record, subject, studentName: student?.name ?? 'A student' })
    }
  }

  attentionStudents.sort((a, b) => a.attendancePercentage - b.attendancePercentage)
  recentRecords.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const recentActivity: DashboardActivityItem[] = recentRecords.slice(0, 5).map((record) => ({
    id: record.id,
    type: record.status === 'present' ? 'success' : 'warning',
    message: `Attendance marked for ${record.studentName} in ${record.subject.name} — ${record.status}`,
    timestamp: record.createdAt.toISOString(),
  }))

  const classesRecordedToday = todaysClasses.filter((c) => c.status === 'recorded').length
  const classesTotalToday = todaysClasses.length

  return {
    pendingAttendanceCount: classesTotalToday - classesRecordedToday,
    stats: {
      avgAttendancePercentage: percentage(totalPresent, totalRecords),
      avgAttendanceTrendPercentage: 0,
      classesRecordedToday,
      classesTotalToday,
      studentsBelowEligibility: belowEligibilityStudentIds.size,
      totalStudents,
      totalSubjects: subjects.length,
    },
    todaysClasses,
    recentActivity,
    studentsNeedingAttention: attentionStudents.slice(0, 5),
  }
}

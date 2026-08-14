export type DashboardClassStatus = 'recorded' | 'upcoming'

export interface DashboardClassSession {
  id: string
  time: string
  durationMinutes: number
  subject: string
  status: DashboardClassStatus
  studentCount: number
  program: string
  semester: string
  room: string
  recordedPresentCount?: number
}

export type DashboardActivityType = 'success' | 'info' | 'warning'

export interface DashboardActivityItem {
  id: string
  type: DashboardActivityType
  message: string
  timestamp: string
}

export interface DashboardAttentionStudent {
  id: string
  name: string
  initials: string
  subject: string
  semester: string
  attendancePercentage: number
}

export interface DashboardStats {
  avgAttendancePercentage: number
  avgAttendanceTrendPercentage: number
  classesRecordedToday: number
  classesTotalToday: number
  studentsBelowEligibility: number
  totalStudents: number
  totalSubjects: number
}

export interface DashboardOverviewResponse {
  pendingAttendanceCount: number
  stats: DashboardStats
  todaysClasses: DashboardClassSession[]
  recentActivity: DashboardActivityItem[]
  studentsNeedingAttention: DashboardAttentionStudent[]
}

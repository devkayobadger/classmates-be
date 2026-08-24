export type AssignmentStatus = 'statuses-entered' | 'in-progress' | 'not-started'
export type AssignmentCompletionStatus = 'done' | 'not_done' | 'late' | 'excused'

export interface AssignmentRecord {
  id: string
  subjectId: string
  title: string
  description: string | null
  assignedDate: string
  dueDate: string
  createdAt: Date
  updatedAt: Date
}

export interface AssignmentStudentStatus {
  id: string
  name: string
  rollNumber: string
  studentCode: string | null
  status: AssignmentCompletionStatus | null
}

export interface AssignmentResponse {
  id: string
  subjectId: string
  subjectName: string
  subjectCode: string
  title: string
  description: string | null
  assignedDate: string
  dueDate: string
  createdAt: string
  updatedAt: string
  studentCount: number
  enteredCount: number
  status: AssignmentStatus
}

export interface AssignmentStatusesResponse {
  id: string
  title: string
  description: string | null
  assignedDate: string
  dueDate: string
  subject: string
  subjectCode: string
  program: string
  semester: string
  students: AssignmentStudentStatus[]
}

export interface CreateAssignmentRequest {
  subjectId: string
  title: string
  description?: string | null
  assignedDate: string
  dueDate: string
}

export interface UpdateAssignmentRequest {
  subjectId?: string
  title?: string
  description?: string | null
  assignedDate?: string
  dueDate?: string
}

export interface AssignmentListFilters {
  subjectId?: string
  search?: string
  status?: AssignmentStatus
}

export interface SaveAssignmentStatusesRequest {
  statuses: Array<{ studentId: string; status: AssignmentCompletionStatus }>
}

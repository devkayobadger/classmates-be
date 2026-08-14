export const MESSAGES = {
  // Validation
  VALIDATION_FAILED: 'Validation failed',

  // Authentication
  ACCESS_TOKEN_MISSING: 'Access token missing',
  INVALID_ACCESS_TOKEN: 'Invalid or expired access token',

  REFRESH_TOKEN_MISSING: 'Refresh token missing',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',

  INVALID_CREDENTIALS: 'Invalid credentials',
  AUTHENTICATION_REQUIRED: 'Authentication credentials were not provided',

  // User
  EMAIL_ALREADY_REGISTERED: 'Email is already registered',
  USER_NOT_FOUND: 'User not found',

  // Student
  ROLL_NUMBER_ALREADY_REGISTERED: 'Roll number is already registered',
  REGISTRATION_NO_ALREADY_REGISTERED: 'Registration number is already registered',

  // Subject
  SUBJECT_CODE_ALREADY_REGISTERED: 'Subject code is already registered',

  // Attendance
  ATTENDANCE_ALREADY_MARKED: 'Attendance is already marked for this student on this date',

  // Enrollment
  STUDENT_ALREADY_ENROLLED: 'Student is already enrolled in this subject',

  // Actions
  LOGGED_OUT_SUCCESSFULLY: 'Logged out successfully',

  // Common
  RESOURCE_NOT_FOUND: 'Resource not found',
  PERMISSION_DENIED: 'Permission denied',
  INTERNAL_SERVER_ERROR: 'Internal server error',
} as const

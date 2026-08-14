export interface UserRecord {
  id: string
  name: string
  email: string
  password: string
  personalId: string | null
  refreshToken: string | null
  createdAt: Date
  updatedAt: Date
}

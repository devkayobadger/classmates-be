declare global {
  namespace Express {
    interface Request {
      userId: string // will be set by auth middleware
    }
  }
}

export {}

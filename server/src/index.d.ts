import type User from './users/user.model'

declare global {
  namespace Express {
    interface Request {
      user: User | undefined
    }
  }
}

import jwt from 'jsonwebtoken'

export default class JwtService {
  readonly SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'
  readonly EXPIRATION_TIME = '1h'

  generateToken(payload: object): string {
    return jwt.sign(payload, this.SECRET_KEY, {
      expiresIn: this.EXPIRATION_TIME,
    })
  }

  verifyToken(token: string): object | string {
    try {
      return jwt.verify(token, this.SECRET_KEY)
    } catch (err) {
      throw new Error('Invalid or expired token')
    }
  }
}

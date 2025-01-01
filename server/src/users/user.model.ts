import bcrypt from 'bcrypt'

export type CreateUserAttributes = {
  username: string
  password: string
  type: 'client' | 'therapist'
}

export type UserAttributes = CreateUserAttributes & {
  id: number
}

export default class User {
  id: number
  password: string
  username: string
  type: 'client' | 'therapist'

  constructor(attrs: UserAttributes) {
    this.id = attrs.id
    this.password = attrs.password
    this.username = attrs.username
    this.type = attrs.type
  }

  static validateCreateAttrs(attrs: CreateUserAttributes) {
    const errors: Record<string, string[]> = {}
    if (!attrs.username) {
      errors.username = ['username is required']
    }

    if (!attrs.password) {
      errors.password = ['password is required']
    } else if (attrs.password.length < 8) {
      errors.password = ['password must be at least 8 characters']
    }

    if (!['client', 'therapist'].includes(attrs.type)) {
      errors.type = ['type must be "client" or "therapist"']
    }

    if (Object.keys(errors).length > 0) throw errors
  }

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
  }
}

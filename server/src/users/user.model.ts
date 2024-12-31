import bcrypt from 'bcrypt'

export type CreateUserAttributes = {
  username: string
  password: string
}

export type UserAttributes = CreateUserAttributes & {
  id: number
}

export default class User {
  id: number
  password: string
  username: string

  constructor(attrs: UserAttributes) {
    this.id = attrs.id
    this.password = attrs.password
    this.username = attrs.username
  }

  static validateCreateAttrs(attrs: CreateUserAttributes) {
    if (!attrs.username) {
      throw new Error('username is required')
    }

    if (!attrs.password) {
      throw new Error('password is required')
    }
  }

  static async hashPassword(user: User) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10)
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
  }
}

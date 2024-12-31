import { inject, injectable } from 'tsyringe'
import { type Knex } from 'knex'
import User from './user.model'
import bcrypt from 'bcrypt'

@injectable()
export default class UserRepository {
  constructor(@inject('KnexInstance') private readonly knex: Knex) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  async create(attrs: { username: string; password: string }): Promise<User> {
    const insertAttrs = {
      username: attrs.username,
      password: await this.hashPassword(attrs.password),
    }

    User.validateCreateAttrs(insertAttrs)

    const [userAttrs] = await this.knex
      .table('users')
      .insert(insertAttrs)
      .returning('*')
    const user = new User(userAttrs)

    return user
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.knex
      .table('users')
      .where('username', username)
      .first()
    return user || null
  }
}
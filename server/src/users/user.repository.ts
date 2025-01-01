import { inject, injectable } from 'tsyringe'
import { type Knex } from 'knex'
import User, { CreateUserAttributes } from './user.model'
import bcrypt from 'bcrypt'

@injectable()
export default class UserRepository {
  constructor(@inject('KnexInstance') private readonly knex: Knex) {}

  async create(attrs: CreateUserAttributes): Promise<User> {
    const insertAttrs = {
      username: attrs.username,
      password: await User.hashPassword(attrs.password),
      type: attrs.type,
    }

    User.validateCreateAttrs(insertAttrs)

    const [userAttrs] = await this.knex
      .table('users')
      .insert(insertAttrs)
      .returning('*')
    const user = new User(userAttrs)

    return user
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.knex.table('users').where('id', id).first()
    return user ? new User(user) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.knex
      .table('users')
      .where('username', username)
      .first()
    return user ? new User(user) : null
  }
}

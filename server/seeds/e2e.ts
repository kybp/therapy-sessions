import dotenv from 'dotenv'
import { Knex } from 'knex'
import User from '../src/users/user.model'

export async function seed(knex: Knex): Promise<void> {
  dotenv.config()

  await knex('users').del()

  const users = [
    {
      username: process.env.USER_USERNAME,
      password: await User.hashPassword(process.env.USER_PASSWORD),
    },
    { username: 'some user', password: User.hashPassword('password123') },
    { username: 'another user', password: User.hashPassword('password123') },
  ]

  await Promise.all(
    users.map((userAttrs) => knex.table('users').insert(userAttrs)),
  )
}

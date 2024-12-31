import { container } from 'tsyringe'
import AuthController from './users/auth.controller'
import UserRepository from './users/user.repository'
import knexInstance from './knex-instance'

container.register(AuthController, { useClass: AuthController })
container.register(UserRepository, { useClass: UserRepository })
container.register('KnexInstance', { useValue: knexInstance })

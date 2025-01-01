import { container } from 'tsyringe'
import AuthController from './users/auth.controller'
import JwtService from './users/jwt.service'
import UserRepository from './users/user.repository'
import knexInstance from './knex-instance'
import SessionRepository from './sessions/session.repository'

container.register(AuthController, { useClass: AuthController })
container.register(JwtService, { useClass: JwtService })
container.register(SessionRepository, { useClass: SessionRepository })
container.register(UserRepository, { useClass: UserRepository })
container.register('KnexInstance', { useValue: knexInstance })

import 'reflect-metadata'
import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import UserRepository from './user.repository'
import User from './user.model'
import AuthController from './auth.controller'

let authController: AuthController
let userRepository: UserRepository
let req: Request
let res: Response

describe('AuthController', () => {
  beforeEach(() => {
    req = { body: {} } as any
    res = { json: vi.fn() } as any

    const user = new User({ id: 22, username: 'user', password: 'pass' })

    userRepository = {
      create: vi.fn().mockResolvedValue(user),
      findByUsername: vi.fn(),
    } as any

    container.registerInstance(UserRepository, userRepository)

    authController = container.resolve(AuthController)
    container.registerInstance(AuthController, authController)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    container.clearInstances()
  })

  describe('actionRegister', () => {
    it('creates the given user', async () => {
      const username = 'joey'
      const password = 'asdf'

      req.body.username = username
      req.body.password = password
      await authController.actionRegister(req, res)

      expect(userRepository.create).toHaveBeenCalledWith({
        username,
        password,
      })
    })

    it('returns the given user as JSON', async () => {
      let user = new User({ id: 1, username: 'joey', password: 'ten' })
      vi.mocked(userRepository.create).mockResolvedValueOnce(user)
      await authController.actionRegister(req, res)
      expect(res.json).toHaveBeenCalledWith({ id: user.id })
    })
  })
})

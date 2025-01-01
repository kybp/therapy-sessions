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
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any

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
      expect(res.json).toHaveBeenCalledWith({
        id: user.id,
        username: user.username,
        token: expect.any(String),
      })
    })
  })

  describe('actionSignIn', () => {
    const username = 'joey'
    const password = 'asdf'

    beforeEach(() => {
      req.body.username = username
      req.body.password = password
    })

    it('finds the requested user', async () => {
      await authController.actionSignIn(req, res)

      expect(userRepository.findByUsername).toHaveBeenCalledWith(username)
    })

    it('returns the given user as JSON if the password matches', async () => {
      let user = new User({ id: 1, username: 'joey', password: 'ten' })
      user.checkPassword = vi.fn().mockReturnValueOnce(true)
      vi.mocked(userRepository.findByUsername).mockResolvedValueOnce(user)
      await authController.actionSignIn(req, res)
      expect(res.json).toHaveBeenCalledWith({
        id: user.id,
        username: user.username,
        token: expect.any(String),
      })
    })

    it('returns an error if the user does not exist', async () => {
      vi.mocked(userRepository.findByUsername).mockResolvedValueOnce(null)
      await authController.actionSignIn(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('returns an error if the password does not match', async () => {
      let user = new User({
        id: 1,
        username: 'joey',
        password: `not ${password}`,
      })
      user.checkPassword = vi.fn().mockReturnValueOnce(false)
      vi.mocked(userRepository.findByUsername).mockResolvedValueOnce(user)
      await authController.actionSignIn(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })
  })
})

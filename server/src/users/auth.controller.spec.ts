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

    const user = new User({
      id: 22,
      username: 'user',
      password: 'pass',
      type: 'therapist',
    })

    userRepository = {
      create: vi.fn().mockResolvedValue(user),
      findByUsername: vi.fn(),
    } as any

    container.registerInstance(UserRepository, userRepository)

    authController = container.resolve(AuthController)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    container.clearInstances()
  })

  describe('register', () => {
    it('creates the given user', async () => {
      const username = 'joey'
      const password = 'asdf'
      const type = 'therapist'

      req.body.username = username
      req.body.password = password
      req.body.type = type
      await authController.register(req, res)

      expect(userRepository.create).toHaveBeenCalledWith({
        username,
        password,
        type,
      })
    })

    it('returns the given user as JSON', async () => {
      let user = new User({
        id: 1,
        username: 'joey',
        password: 'ten',
        type: 'client',
      })
      vi.mocked(userRepository.create).mockResolvedValueOnce(user)
      await authController.register(req, res)
      expect(res.json).toHaveBeenCalledWith({
        id: user.id,
        username: user.username,
        type: user.type,
        token: expect.any(String),
      })
    })
  })

  describe('signIn', () => {
    const username = 'joey'
    const password = 'asdf'

    beforeEach(() => {
      req.body.username = username
      req.body.password = password
    })

    it('finds the requested user', async () => {
      await authController.signIn(req, res)

      expect(userRepository.findByUsername).toHaveBeenCalledWith(username)
    })

    it('returns the given user as JSON if the password matches', async () => {
      let user = new User({
        id: 1,
        username: 'joey',
        password: 'ten',
        type: 'client',
      })
      user.checkPassword = vi.fn().mockReturnValueOnce(true)
      vi.mocked(userRepository.findByUsername).mockResolvedValueOnce(user)
      await authController.signIn(req, res)
      expect(res.json).toHaveBeenCalledWith({
        id: user.id,
        username: user.username,
        type: user.type,
        token: expect.any(String),
      })
    })

    it('returns an error if the user does not exist', async () => {
      vi.mocked(userRepository.findByUsername).mockResolvedValueOnce(null)
      await authController.signIn(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('returns an error if the password does not match', async () => {
      let user = new User({
        id: 1,
        username: 'joey',
        password: `not ${password}`,
        type: 'therapist',
      })
      user.checkPassword = vi.fn().mockReturnValueOnce(false)
      vi.mocked(userRepository.findByUsername).mockResolvedValueOnce(user)
      await authController.signIn(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })
  })
})

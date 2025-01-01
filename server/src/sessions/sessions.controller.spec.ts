import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import SessionsController from './sessions.controller'
import Session from './session.model'
import SessionRepository from './session.repository'
import User from '../users/user.model'

let sessionsController: SessionsController
let sessionRepository: SessionRepository
let req: Request
let res: Response

describe('SessionsController', () => {
  let user: User

  beforeEach(() => {
    req = { body: {} } as any
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any

    const session = new Session({
      id: 22,
      therapist: 1,
      therapistName: 'alice',
      client: 1,
      clientName: 'bob',
      date: new Date().toISOString(),
    })
    user = new User({
      id: 22,
      username: 'user',
      password: 'pass',
      type: 'client',
    })

    sessionRepository = {
      create: vi.fn().mockResolvedValue(session),
      findByTherapist: vi.fn().mockResolvedValue([]),
      findByClient: vi.fn().mockResolvedValue([]),
    } as any

    container.registerInstance(SessionRepository, sessionRepository)

    sessionsController = container.resolve(SessionsController)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    container.clearInstances()
  })

  describe('dashboard', () => {
    it('finds by therapist when the user is a therapist', async () => {
      user.type = 'therapist'
      req.user = user
      await sessionsController.dashboard(req, res)
      expect(sessionRepository.findByTherapist).toHaveBeenCalledWith(user.id)
    })

    it('finds by client when the user is a client', async () => {
      user.type = 'client'
      req.user = user
      await sessionsController.dashboard(req, res)
      expect(sessionRepository.findByClient).toHaveBeenCalledWith(user.id)
    })

    it('returns the given dashboard as JSON', async () => {
      user.type = 'client'
      req.user = user
      const session = new Session({
        id: 22,
        therapist: 1,
        therapistName: 'joe',
        client: user.id,
        clientName: 'art',
        date: new Date().toISOString(),
      })
      vi.mocked(sessionRepository.findByClient).mockResolvedValueOnce([session])
      await sessionsController.dashboard(req, res)
      expect(res.json).toHaveBeenCalledWith([session])
    })
  })
})

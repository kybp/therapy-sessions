import { type Knex } from 'knex'
import { container } from 'tsyringe'
import SessionRepository from './session.repository'
import Session from './session.model'
import UserRepository from '../users/user.repository'
import User from '../users/user.model'

let knex: Knex
let session: Session
let userRepo: UserRepository
let sessionRepo: SessionRepository
let user: User

describe('SessionRepository', () => {
  beforeEach(() => {
    user = new User({ id: 1, username: 'foo', password: 'bar', type: 'client' })

    session = new Session({
      id: 1,
      therapist: 1,
      therapistName: 'bill',
      client: 2,
      clientName: 'ted',
      date: new Date().toISOString(),
    })

    knex = {
      insert: vi.fn().mockReturnThis(),
      table: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      join: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue([session]),
      returning: vi.fn().mockResolvedValue([session]),
    } as any

    container.registerInstance('KnexInstance', knex)

    userRepo = {
      findById: vi.fn().mockResolvedValue(user),
    } as any

    container.registerInstance(UserRepository, userRepo)

    sessionRepo = container.resolve(SessionRepository)
    container.registerInstance(SessionRepository, sessionRepo)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    container.clearInstances()
  })

  describe('create', () => {
    it('inserts the session into the database with a hashed password', async () => {
      const attrs = {
        therapist: session.therapist,
        client: session.client,
        date: session.date,
      }

      await sessionRepo.create(attrs)

      expect(knex.insert).toHaveBeenCalledWith(attrs)
    })

    it('returns a session', async () => {
      vi.mocked(knex.returning)?.mockResolvedValueOnce([session])

      const createdSession = await sessionRepo.create(session)

      expect(createdSession).toBeInstanceOf(Session)
      expect(createdSession.id).toBe(session.id)
    })
  })

  describe('findByTherapist', () => {
    it('returns the first matching session in the sessions table', async () => {
      await sessionRepo.findByTherapist(session.therapist!)

      expect(knex.table).toHaveBeenCalledWith('sessions')
      expect(knex.select).toHaveBeenCalled()
    })

    it('returns a session when the therapist has sessions', async () => {
      const foundSessions = await sessionRepo.findByTherapist(
        session.therapist!,
      )

      expect(foundSessions).toEqual([session])
    })

    it('returns empty when the therapist has no sessions', async () => {
      vi.mocked(knex.select).mockResolvedValueOnce([])
      const foundSession = await sessionRepo.findByTherapist(2)
      expect(foundSession).toEqual([])
    })
  })
})

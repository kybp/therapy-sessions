import bcrypt from 'bcrypt'
import { type Knex } from 'knex'
import { container } from 'tsyringe'
import UserRepository from './user.repository'
import User from './user.model'

let knex: Knex
let user: User
let userRepository: UserRepository

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
  },
}))

describe('UserRepository', () => {
  beforeEach(() => {
    user = new User({
      id: 1,
      username: 'testuser',
      password: 'password123',
      type: 'client',
    })

    User.validateCreateAttrs = vi.fn().mockResolvedValueOnce(undefined)

    knex = {
      insert: vi.fn().mockReturnThis(),
      table: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      first: vi.fn().mockResolvedValue(user),
      returning: vi.fn().mockResolvedValue([user]),
    } as any

    container.registerInstance('KnexInstance', knex)

    userRepository = container.resolve(UserRepository)
    container.registerInstance(UserRepository, userRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    container.clearInstances()
  })

  describe('create', () => {
    it('inserts the user into the database with a hashed password', async () => {
      const passwordHash = 'some password hash'
      vi.mocked(bcrypt.hash).mockResolvedValueOnce(passwordHash as any)

      const attrs = {
        username: user.username,
        password: user.password,
        type: user.type,
      }

      await userRepository.create(attrs)

      expect(knex.insert).toHaveBeenCalledWith({
        ...attrs,
        password: passwordHash,
      })
    })

    it('returns a user', async () => {
      vi.mocked(knex.returning)?.mockResolvedValueOnce([user])

      const createdUser = await userRepository.create(user)

      expect(createdUser).toBeInstanceOf(User)
      expect(createdUser.id).toBe(user.id)
    })
  })

  describe('findByUsername', () => {
    it('returns the first matching user in the users table', async () => {
      await userRepository.findByUsername(user.username)

      expect(knex.table).toHaveBeenCalledWith('users')
      expect(knex.where).toHaveBeenCalledWith('username', user.username)
      expect(knex.first).toHaveBeenCalled()
    })

    it('returns a user when the username exists in the database', async () => {
      const foundUser = await userRepository.findByUsername(user.username)
      expect(foundUser).toEqual(user)
    })

    it('returns null when the username does not exist in the database', async () => {
      vi.mocked(knex.first).mockResolvedValueOnce(null as any)
      const foundUser = await userRepository.findByUsername('nonexistentuser')
      expect(foundUser).toBeNull()
    })
  })
})

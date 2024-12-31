import User, { CreateUserAttributes } from './user.model'

describe('User model', () => {
  describe('validateCreateAttrs', () => {
    let validAttrs: CreateUserAttributes

    beforeEach(() => {
      validAttrs = {
        username: 'username',
        password: 'password',
      }
    })

    it('returns undefined for valid attributes', () => {
      expect(User.validateCreateAttrs(validAttrs)).toBeUndefined()
    })

    it('throws when username is blank', () => {
      const invalidAttrs = { ...validAttrs, username: '' }
      expect(() => User.validateCreateAttrs(invalidAttrs)).toThrowError()
    })

    it('throws when password is blank', () => {
      const invalidAttrs = { ...validAttrs, password: '' }
      expect(() => User.validateCreateAttrs(invalidAttrs)).toThrowError()
    })
  })
})

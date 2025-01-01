import User, { CreateUserAttributes } from './user.model'

describe('User model', () => {
  describe('validateCreateAttrs', () => {
    let validAttrs: CreateUserAttributes

    beforeEach(() => {
      validAttrs = {
        username: 'username',
        password: 'password',
        type: 'client',
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

    it('throws when type is neither client nor therapist', () => {
      const clientAttrs = { ...validAttrs, type: 'client' as const }
      expect(() => User.validateCreateAttrs(clientAttrs)).not.toThrowError()
      const therapistAttrs = { ...validAttrs, type: 'therapist' as const }
      expect(() => User.validateCreateAttrs(therapistAttrs)).not.toThrowError()
      const invalidAttrs = { ...validAttrs, type: 'foo' as any }
      expect(() => User.validateCreateAttrs(invalidAttrs)).toThrowError()
    })
  })
})

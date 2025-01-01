import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
import UserRepository from './user.repository'
import JwtService from './jwt.service'
import User from './user.model'

@injectable()
export default class AuthController {
  constructor(
    @inject(JwtService) private readonly jwtService: JwtService,
    @inject(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  private credentialError(res: Response) {
    res.status(401).json({ error: 'invalid credentials' })
    return
  }

  async register(req: Request, res: Response) {
    try {
      const { username, password, type } = req.body
      const user = await this.userRepo.create({ username, password, type })
      const token = this.generateTokenForUser(user)

      // TODO: Make this view a class
      res.json({ id: user.id, username: user.username, type: user.type, token })
    } catch (error) {
      res.status(422).json(error)
    }
  }

  async signIn(req: Request, res: Response) {
    const { username, password } = req.body
    const user = await this.userRepo.findByUsername(username)

    if (!user) return this.credentialError(res)
    if (!(await user.checkPassword(password))) return this.credentialError(res)

    const token = this.generateTokenForUser(user)

    // TODO: Make this view a class
    res.json({ id: user.id, username: user.username, type: user.type, token })
  }

  private generateTokenForUser(user: User): string {
    return this.jwtService.generateToken({
      id: user.id,
      username: user.username,
      type: user.type,
    })
  }
}

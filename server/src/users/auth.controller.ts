import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
import UserRepository from './user.repository'

@injectable()
export default class AuthController {
  constructor(
    @inject(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  async actionRegister(req: Request, res: Response) {
    const { username, password } = req.body
    const user = await this.userRepo.create({ username, password })
    res.json({ id: user.id })
  }
}

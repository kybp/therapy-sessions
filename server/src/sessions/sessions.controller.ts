import { inject, injectable } from 'tsyringe'
import type { Request, Response } from 'express'
import SessionRepository from './session.repository'

@injectable()
export default class SessionsController {
  constructor(
    @inject(SessionRepository) private readonly sessionRepo: SessionRepository,
  ) {}

  async create(req: Request, res: Response) {
    const therapist = req.user!.id
    const session = await this.sessionRepo.create({
      therapist,
      client: null,
      date: req.body.date,
    })
    res.status(201).json(session)
  }

  async book(req: Request, res: Response) {
    const session = await this.sessionRepo.findById(+req.params.id)
    const user = req.user!.id

    if (!session.client) {
      await this.sessionRepo.book(session, user)
      res.json(session)
    } else {
      res.status(422).json({ error: 'Session already booked.' })
    }
  }

  async dashboard(req: Request, res: Response) {
    switch (req.user!.type) {
      case 'therapist':
        res.json(await this.sessionRepo.findByTherapist(req.user!.id))
        return
      case 'client':
        res.json(await this.sessionRepo.findByClient(req.user!.id))
        return
      default:
        console.error('unknown user type:', req.user!.type)
    }
  }

  async openSessions(req: Request, res: Response) {
    const sessions = await this.sessionRepo.findByClient(null)
    res.json(sessions)
  }
}

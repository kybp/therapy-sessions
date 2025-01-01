import { inject, injectable } from 'tsyringe'
import { type Knex } from 'knex'
import Session, { CreateSessionAttributes } from './session.model'
import UserRepository from '../users/user.repository'

@injectable()
export default class SessionRepository {
  constructor(
    @inject('KnexInstance') private readonly knex: Knex,
    @inject(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  async create(attrs: CreateSessionAttributes): Promise<Session> {
    const therapist = await this.userRepo.findById(attrs.therapist)

    if (!therapist) throw new Error('therapist not found')

    const insertAttrs = {
      therapist: attrs.therapist,
      client: attrs.client,
      date: attrs.date,
    }

    const [sessionAttrs] = await this.knex
      .table('sessions')
      .insert(insertAttrs)
      .returning('*')

    const session = new Session({
      ...sessionAttrs,
      therapistName: therapist.username,
    })

    return session
  }

  async findById(id: number): Promise<Session> {
    const session = await this.knex.table('sessions').where('id', id).first()

    return new Session(session)
  }

  async findByTherapist(therapist: number): Promise<Session[]> {
    const sessions = await this.knex
      .table('sessions')
      .join('users as therapists', 'sessions.therapist', 'therapists.id')
      .leftJoin('users as clients', 'sessions.client', 'clients.id')
      .where((builder) => {
        if (therapist) builder.where('therapist', therapist)
        else builder.whereNull('sessions.client')
      })
      .select(
        'sessions.*',
        'therapists.username as therapistName',
        'clients.username as clientName',
      )

    return sessions.map((attrs) => new Session(attrs))
  }

  async findByClient(client: number | null): Promise<Session[]> {
    const sessions = await this.knex
      .table('sessions')
      .join('users as therapists', 'sessions.therapist', 'therapists.id')
      .leftJoin('users as clients', 'sessions.client', 'clients.id')
      .where((builder) => {
        if (client) builder.where('sessions.client', client)
        else builder.whereNull('sessions.client')
      })
      .select(
        'sessions.*',
        'therapists.username as therapistName',
        'clients.username as clientName',
      )

    return sessions.map((attrs) => new Session(attrs))
  }

  async book(session: Session, client: number) {
    await this.knex
      .table('sessions')
      .where('id', session.id)
      .update('client', client)

    session.client = client
  }
}

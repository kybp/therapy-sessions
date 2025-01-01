export type CreateSessionAttributes = {
  therapist: number
  date: string
  client: number | null
}

export type SessionAttributes = CreateSessionAttributes & {
  id: number
  therapistName: string
  clientName: string | null
}

export default class Session {
  id: number
  therapist: number
  therapistName: string
  client: number | null
  clientName: string | null
  date: string

  constructor(attrs: SessionAttributes) {
    this.id = attrs.id
    this.therapist = attrs.therapist
    this.therapistName = attrs.therapistName
    this.client = attrs.client
    this.clientName = attrs.clientName
    this.date = attrs.date
  }
}

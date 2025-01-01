import { Router } from 'express'
import authRouter from './users/auth.router'
import sessionsRouter from './sessions/sessions.router'

const router = Router()

router.use('/auth', authRouter)
router.use('/sessions', sessionsRouter)

export default router

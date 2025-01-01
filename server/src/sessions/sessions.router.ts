import { container } from 'tsyringe'
import { Router } from 'express'
import SessionsController from './sessions.controller'
import authenticateJwt from '~/users/authenticateJwt.middleware'

const router = Router()

const sessionsController = container.resolve(SessionsController)

router.use(authenticateJwt)

router.get('/', sessionsController.dashboard.bind(sessionsController))
router.get('/open', sessionsController.openSessions.bind(sessionsController))
router.post('/', sessionsController.create.bind(sessionsController))
router.post('/:id/book', sessionsController.book.bind(sessionsController))

export default router

import { container } from 'tsyringe'
import { Router } from 'express'
import AuthController from '~/users/auth.controller'

const router = Router()

const authController = container.resolve(AuthController)

router.post('/register', authController.actionRegister.bind(authController))

export default router

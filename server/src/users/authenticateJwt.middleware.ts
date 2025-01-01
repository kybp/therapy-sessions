import { NextFunction, Request, RequestHandler, Response } from 'express'
import { container } from 'tsyringe'
import JwtService from './jwt.service'
import User from './user.model'

const authenticateJwt: RequestHandler = (req, res, next) => {
  const jwtService = container.resolve(JwtService)
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    res.status(401).send('Token required')
    return
  }

  const jwt = jwtService.verifyToken(token)

  if (!jwt) {
    res.status(403).send('Invalid token')
    return
  }

  req.user = jwt as User

  next()
}

export default authenticateJwt

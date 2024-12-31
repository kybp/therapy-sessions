import 'reflect-metadata'
import './container.registry'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import routes from './routes'

dotenv.config()

const app = express()
const port = 3001

const clientBuild = path.resolve(__dirname, '../../client/build')
app.use(express.static(clientBuild))
app.use(express.json())

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
  }),
)

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

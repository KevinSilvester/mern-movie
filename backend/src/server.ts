import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import config from 'config'
import cors from 'cors'
import connect from './utils/connect'
import logger from './utils/logger'
import router from './router'

const port = config.get<number>('port')
const app = express()

app.use(
   helmet({
      contentSecurityPolicy: {
         directives: {
            defaultSrc: ["'self'"],
            objectSrc: ["'self'"],
            mediaSrc: ["'self'"]
         }
      },
      crossOriginEmbedderPolicy: false
   })
)
app.use(cors({ origin: '*' }))
app.use(morgan('combined'))
app.use(express.json({ limit: '6mb' }))
app.use(express.urlencoded({ extended: true, limit: '6mb' }))
app.use('/', router)

app.listen(port, '0.0.0.0', async () => {
   logger.info(`Server running at http://localhost:${port}`)
   await connect()
})

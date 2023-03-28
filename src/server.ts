import path from 'node:path'
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
            scriptSrc: ["'self'", "'unsafe-inline'", 'blob:', '*'],
            styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'blob:', '*'],
            connectSrc: ["'self'", '*', 'data:'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            objectSrc: ["'self'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", 'https://www.youtube.com']
         }
      },
      crossOriginEmbedderPolicy: false
   })
)
app.use(
   cors({
      origin: '*'
      // origin: 'http://localhost:4000'
   })
)
app.use(morgan('combined'))
app.use(express.json({ limit: '6mb' }))
app.use(express.urlencoded({ extended: true, limit: '6mb' }))
app.use('/api', router)

if (process.env.NODE_ENV === 'production') {
   app.use('/', express.static(path.join(__dirname, '..', 'client', 'dist')))
}

app.listen(port, '0.0.0.0', async () => {
   logger.info(`Server running at http://localhost:${port}`)
   await connect()
})

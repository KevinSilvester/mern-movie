import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import config from 'config'
import cors from 'cors'
import connect from './utils/connect'
import logger from './utils/logger'
import router from './router/router'
import { errorHandler, notFoundHandler } from './utils/error'

const port = config.get<number>('port')

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use('/api', router)
// app.use(errorHandler);
// app.use(notFoundHandler);

app.listen(port, async () => {
   logger.info(`Server running at http://localhost:${port}`)
   await connect()
})

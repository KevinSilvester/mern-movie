import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import postRoutes from './routes/posts-route.js'
import externalRoute from './routes/external-route.js'

dotenv.config({ path: './.env.local' })

const PORT = process.env.PORT || 4000
const CORS_OPT = {
   origin: process.env.CLIENT_DEV
}

mongoose
   .connect(process.env.MDB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
   })
   .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
   .catch(err => console.log('Error: ' + err))

// deprecated
// mongoose.set('useFindAndModify', false)

const app = express()

app.use('/posts', postRoutes)

app.use('/external', externalRoute)

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors(CORS_OPT))

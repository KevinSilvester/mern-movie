import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import movieRoute from './routes/movie-route.js'

dotenv.config({ path: './.env.local' })

const PORT = process.env.PORT || 4000
const CORS_OPT = { origin: process.env.CLIENT_DEV }
const app = express()

/**
 * useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options.
 * Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true,
 * and useFindAndModify is false. Please remove these options from your code.
 * 
 * source: https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
 */
mongoose
   .connect(process.env.MDB_CONNECTION)
   .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
   .catch(err => console.log('Error: ' + err))
   
   app.use(bodyParser.json({ limit: '30mb', extended: true }))
   app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
   app.use(cors(CORS_OPT))
   app.use('/api/movies', movieRoute)
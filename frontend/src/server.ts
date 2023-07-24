import path from 'node:path'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

const port = parseInt(process.env.PORT as string, 10) || 3001
const app = express()

console.log(path.join(__dirname))

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
app.use(cors({ origin: 'https://mern-movie.keivns.site' }))
app.use(morgan('combined'))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))
app.use('/', express.static(path.join(__dirname)))

app.listen(port, '0.0.0.0', () => {
   console.log(`Server running at http://localhost:${port}`)
})

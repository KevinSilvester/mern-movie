import express from 'express'
import axios from 'axios'
import got from 'got'
import { pipeline } from 'stream'

const router = express.Router()

router.get('/data.json', async function(req, res) {
   const dataStream = got.stream({
      url: 'https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json'
   })
   pipeline(dataStream, res, (err) => {
      if (err) {
         console.log('Error: ' + err)
         res.sendStatus(500)
      }
   })
})


export default router
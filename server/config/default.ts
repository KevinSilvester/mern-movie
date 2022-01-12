import dotenv from 'dotenv'

dotenv.config()

export default {
   port: parseInt(process.env.PORT as string, 10) || 4000,
   dbUri: process.env.MDB_URI,
   mdbKey: process.env.MDB_KEY,
   apiKey: process.env.API_KEY,
}
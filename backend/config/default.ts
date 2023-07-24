import dotenv from 'dotenv'

dotenv.config()

export default {
   port: parseInt(process.env.PORT as string, 10) || 4000,
   mongoUri: process.env.MONGO_URI,
   mongoDbName: process.env.MONGO_DBNAME,
   mdbKey: process.env.MOVIEDB_API_KEY
}

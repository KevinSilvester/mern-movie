import mongoose from 'mongoose'
import config from 'config'
import logger from './logger'

const connect = async (): Promise<void> => {
   const dbUri = config.get<string>('mongoUri')
   const dbName = config.get<string>('mongoDbName')

   logger.info(dbName)

   try {
      await mongoose.connect(dbUri, { dbName })
      logger.info('Connected to DB')
   } catch (err) {
      logger.fatal('DB connected failed!' + err)
      process.exit(1)
   }
}

export default connect

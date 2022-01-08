import mongoose from 'mongoose'
import config from 'config'
import logger from './logger'

/**
 * useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options.
 * Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true,
 * and useFindAndModify is false. Please remove these options from your code.
 *
 * source: https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
 */
const connect = async (): Promise<void> => {
   const dbUri = config.get<string>('dbUri')

   try {
      await mongoose.connect(dbUri)
      logger.info('Connected to DB')
   } catch (err) {
      logger.fatal('DB connected failed!' + err)
      process.exit(1)
   }
}

export default connect

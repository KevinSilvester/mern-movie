import pino from 'pino'

/**
 * Logger with json data formatting
 */
const logger = pino({
   transport: {
      target: 'pino-pretty',
      options: {
         colorize: true,
         timestampKey: ``,
      },
   },
   base: {
      pid: false
   },
})

export default logger

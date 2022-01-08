import { ZodError } from 'zod'

/**
 * Returns the ZodError in more easily readable sting format.
 * @param err ZodError
 * @returns Array of messages
 */
const zError = <T extends ZodError>(err: T) => {
   return err.flatten().fieldErrors.body || err.flatten().formErrors
}

export default zError

import fp from 'fastify-plugin';
import { HttpErrorCodes } from '@fastify/sensible/lib/httpError.js';

export class HttpCompatibleError {
  public originalErrors: unknown[] = [];

  constructor(
    public statusCode: HttpErrorCodes,
    public message: string,
  ) {}

  populateOriginalErrors(...errors: unknown[]) {
    this.originalErrors.push(...errors);
    return this;
  }
}

export default fp(async (fastify) => {
  fastify.setErrorHandler((error) => {
    if (error instanceof HttpCompatibleError) {
      const { originalErrors } = error;
      if (originalErrors.length > 0) {
        originalErrors.forEach((e) => {
          if (typeof e === 'object' && e !== null) {
            fastify.log.error(e);
          } else if (typeof e === 'string') {
            fastify.log.error(e);
          } else {
            fastify.log.error('Unexpected #error#.');
          }
        });
      }
      return fastify.httpErrors.createError(error.statusCode, error.message);
    }
    return error;
  });
});

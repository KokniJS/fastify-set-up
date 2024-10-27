import fp from 'fastify-plugin';
import { Either, isEither, left } from '@sweet-monads/either';
import { HttpCompatibleError } from './handle-http-error.js';
import { User } from '../di/db/schemas/user.js';

export default fp(async (fastify) => {
  fastify.decorateRequest('currentUser', null);

  // req.currentUser can be populated during access/refresh token verification (onRequest hook).
  fastify.addHook('preParsing', async (req) => {
    if (isEither(req.currentUser)) {
      return;
    }
    req.currentUser = left(new HttpCompatibleError(500, 'Trying to get the current user on a route without an access/refresh token.'));
  });
});

declare module 'fastify' {
  export interface FastifyRequest {
    currentUser: Either<HttpCompatibleError, User>;
  }
}

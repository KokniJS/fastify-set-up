import fp from 'fastify-plugin';
import { Either, isEither, left } from '@sweet-monads/either';
import { HttpCompatibleError } from './handle-http-error.js';
import { AccessTokenPayload } from '../di/jwt/utils/issue.js';

export default fp(async (fastify) => {
  fastify.decorateRequest('jwtPayload', null);

  // req.jwtPayload can be populated during token verification.
  fastify.addHook('preParsing', async (req) => {
    if (isEither(req.jwtPayload)) {
      return;
    }
    req.jwtPayload = left(new HttpCompatibleError(500, 'Trying to get the jwtPayload on a route without a jwt parsing.'));
  });
});

declare module 'fastify' {
  export interface FastifyRequest {
    jwtPayload: Either<HttpCompatibleError, AccessTokenPayload>;
  }
}

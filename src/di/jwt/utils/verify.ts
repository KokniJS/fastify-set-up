import { JWT } from '@fastify/jwt';
import { FastifyRequest, onRequestAsyncHookHandler } from 'fastify';
import { right } from '@sweet-monads/either';
import { AccessTokenPayload, TokenType } from './issue.js';
import { Db } from '../../db/index.js';

export class Verify {
  constructor(private jwtLib: JWT, private db: Db) {}

  accessToken: onRequestAsyncHookHandler = async (req) => {
    const payload = this.getTokenPayload(req, TokenType.ACCESS);

    const maybeUser = await this.db.userRepos.getById(payload.sub);

    if (!maybeUser) {
      throw req.server.httpErrors.unauthorized();
    }

    req.currentUser = right(maybeUser);
    req.jwtPayload = right(payload);
  };

  private getToken(req: FastifyRequest) {
    return req.headers.authorization?.slice('Bearer '.length);
  }

  private getTokenPayload(req: FastifyRequest, tokenType: TokenType.ACCESS): AccessTokenPayload;
  private getTokenPayload(req: FastifyRequest, tokenType: TokenType): any {
    const token = this.getToken(req);
    if (!token) {
      throw req.server.httpErrors.unauthorized();
    }

    let payload: AccessTokenPayload;
    try {
      payload = this.jwtLib.verify(token);
    } catch (error) {
      throw req.server.httpErrors.unauthorized();
    }

    if (payload.type !== tokenType) {
      throw req.server.httpErrors.unauthorized();
    }

    return payload;
  }
}

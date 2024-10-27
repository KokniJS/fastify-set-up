import { JWT } from '@fastify/jwt';
import { User } from '../../db/schemas/user';

export enum TokenType {
  ACCESS = 'access',
}

interface BaseTokenPayload {
  iat: number;
  exp: number;
  type: TokenType;
}

export interface AccessTokenPayload extends BaseTokenPayload {
  sub: string;
  name: string;
  type: TokenType.ACCESS;
}

export class Issue {
  ttlForAccessInSec = 60 * 30; // 30 mins

  constructor(private jwtLib: JWT) {}

  async newAccessToken(user: User) {
    const accessToken = await this.jwtLib.sign(
      { type: TokenType.ACCESS },
      {
        sub: user._id.toString(),
        expiresIn: this.ttlForAccessInSec,
        algorithm: this.jwtLib.options.sign.algorithm,
      },
    );
    return { accessToken };
  }
}

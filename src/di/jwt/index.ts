import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { Lifetime, asClass } from 'awilix';
import { Issue } from './utils/issue.js';
import { Verify } from './utils/verify.js';
import { Db, diDb } from '../db/index.js';
import { diFastify } from '../fastify/index.js';

export const diJwt = 'diJwt';

export class Jwt {
  issue: Issue;
  verify: Verify;

  constructor(diContainer: { [diFastify]: FastifyInstance; [diDb]: Db }) {
    const fastify = diContainer[diFastify];
    const db = diContainer[diDb];

    this.issue = new Issue(fastify.jwt);
    this.verify = new Verify(fastify.jwt, db);
  }
}

export default fp(
  async (fastify) => {
    fastify.diContainer.register({
      [diJwt]: asClass(Jwt, {
        lifetime: Lifetime.SINGLETON,
      }),
    });
  },
  {
    name: diJwt,
  },
);

import fp from 'fastify-plugin';
import { asClass, Lifetime } from 'awilix';
import { User } from '../db/schemas/user';
import { Db, diDb } from '../db';
import { FastifyInstance } from 'fastify';
import { diFastify } from '../fastify';

export const diUserService = 'diUserService';

export class UserService {
  private db: Db;
  private fastify: FastifyInstance;

  constructor(diContainer: { [diDb]: Db; [diFastify]: FastifyInstance }) {
    this.db = diContainer[diDb];
    this.fastify = diContainer[diFastify];
  }

  async create(creationAttrs: User) {
    return this.db.userRepos.create(creationAttrs);
  }

  async getById(id: string) {
    const user = await this.db.userRepos.getById(id);
    if (!user) throw this.fastify.httpErrors.badRequest('User not found');
    return user;
  }
}

export default fp(
  async (fastify) => {
    fastify.diContainer.register({
      [diUserService]: asClass(UserService, {
        lifetime: Lifetime.SINGLETON,
      }),
    });
  },
  {
    name: diUserService,
  },
);

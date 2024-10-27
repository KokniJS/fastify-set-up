import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { schemaTags } from '../../utils/schema-tags';
import { Db, diDb } from '../../di/db';
import { diJwt, Jwt } from '../../di/jwt';
import { authTokensSchema, CreateTokens, CreateTokensSchema } from './shema';

const func: FastifyPluginAsyncTypebox = async (fastify) => {
  schemaTags(fastify, 'auth');

  const db = fastify.diContainer.resolve<Db>(diDb);
  const jwt = fastify.diContainer.resolve<Jwt>(diJwt);

  fastify.route<{ Body: CreateTokens }>({
    url: '/auth-tokens',
    method: 'POST',
    schema: {
      body: CreateTokensSchema,
      response: {
        200: authTokensSchema,
      },
    },
    async handler(req) {
      const { id } = req.body;
      const maybeUser = await db.userRepos.getById(id);

      if (!maybeUser) throw fastify.httpErrors.badRequest('User not found');

      return jwt.issue.newAccessToken(maybeUser);
    },
  });
};

export default func;

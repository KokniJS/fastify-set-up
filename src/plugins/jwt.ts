import fp from 'fastify-plugin';
import { fastifyJwt } from '@fastify/jwt';
import { envPluginTag } from './env.js';

export default fp(
  async (fastify) =>
    fastify.register(fastifyJwt, {
      secret: fastify.config.JWT_SECRET,
      sign: {
        algorithm: 'HS512',
      },
    }),
  {
    dependencies: [envPluginTag],
  },
);

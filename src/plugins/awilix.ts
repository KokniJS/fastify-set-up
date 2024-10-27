import fp from 'fastify-plugin';
import { fastifyAwilixPlugin } from '@fastify/awilix';

export default fp(async (fastify) =>
  fastify.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
  }),
);

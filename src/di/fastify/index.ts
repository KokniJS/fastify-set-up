import fp from 'fastify-plugin';
import { asValue } from 'awilix';

export const diFastify = 'diFastify';

export default fp(
  async (fastify) => {
    fastify.diContainer.register({
      [diFastify]: asValue(fastify),
    });
  },
  {
    name: diFastify,
  },
);

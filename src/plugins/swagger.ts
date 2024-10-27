import fp from 'fastify-plugin';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { envPluginTag } from './env.js';

export const apiKey = 'BearerKey';

export default fp(
  async (fastify) => {
    if (fastify.config.NODE_ENV === 'local') {
      await fastify.register(fastifySwagger, {
        swagger: {
          info: {
            title: 'BOT',
            version: 'fe-1',
          },
          securityDefinitions: {
            [apiKey]: {
              description: 'Authorization header token, sample: "Bearer #TOKEN#"',
              type: 'apiKey',
              name: 'Authorization',
              in: 'header',
            },
          },
        },
      });
      await fastify.register(fastifySwaggerUi, {
        routePrefix: 'docs',
      });
      fastify.log.info(`Swagger listening at http://localhost:${fastify.config.FASTIFY_PORT}/docs`);
    }
  },
  {
    dependencies: [envPluginTag],
  },
);

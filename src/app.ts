import { join } from 'path';
import { fastifyAutoload } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';

const app: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  void fastify.register(fastifyAutoload, {
    dir: join(__dirname, 'plugins'),
    options: opts,
  });

  void fastify.register(fastifyAutoload, {
    dir: join(__dirname, 'di'),
    ...opts,
  });

  void fastify.register(fastifyAutoload, {
    dir: join(__dirname, 'custom-plugins'),
    options: opts,
    dirNameRoutePrefix: false,
  });

  void fastify.register(fastifyAutoload, {
    dir: join(__dirname, 'routes'),
    options: opts,
  });
};

export default app;

import { FastifyInstance } from 'fastify';

export function schemaTags(fastify: FastifyInstance, ...tags: string[]) {
  fastify.addHook('onRoute', (opts) => {
    if ((opts.schema ??= {}).hide !== true) {
      opts.schema.tags = tags;
    }
  });
}

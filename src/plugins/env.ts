import fp from 'fastify-plugin';
import { fastifyEnv } from '@fastify/env';
import { Type, Static } from '@fastify/type-provider-typebox';

export const envPluginTag = 'envPluginTag';

const schema = Type.Object(
  {
    NODE_ENV: Type.String(),

    FASTIFY_PORT: Type.Number(),

    MONGODB_PORT: Type.String(),
    MONGODB_DB_NAME: Type.String(),
    MONGODB_PASSWORD: Type.String(),
    MONGODB_USER: Type.String(),

    JWT_SECRET: Type.String(),
  },
  {
    additionalProperties: false,
  },
);

export default fp(
  async (fastify) =>
    fastify.register(fastifyEnv, {
      dotenv: true,
      schema,
    }),
  {
    name: envPluginTag,
  },
);

declare module 'fastify' {
  interface FastifyInstance {
    config: Static<typeof schema>;
  }
}

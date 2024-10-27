import fp from 'fastify-plugin';
import { Jwt, diJwt } from '../di/jwt/index.js';
import { apiKey } from '../plugins/swagger.js';

export default fp(async (fastify) => {
  const jwt = fastify.diContainer.resolve<Jwt>(diJwt);

  fastify.addHook('onRoute', ({ schema, onRequest }) => {
    if (schema && schema.hide !== true) {
      if (typeof onRequest === 'function') {
        const isSecured = Object.values(jwt.verify).includes(onRequest);
        if (!isSecured) {
          return;
        }
        schema.security = [{ [apiKey]: [] }];
      }
    }
  });
});

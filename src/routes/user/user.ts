import { FastifyPluginAsync } from 'fastify';
import { diUserService, UserService } from '../../di/user/service';
import { BodySchema, CreateSchema, ParamsSchema, ParamsType } from './shema';
import { schemaTags } from '../../utils/schema-tags';
import { diJwt, Jwt } from '../../di/jwt';

const func: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  schemaTags(fastify, 'user');

  const service = fastify.diContainer.resolve<UserService>(diUserService);
  const jwt = fastify.diContainer.resolve<Jwt>(diJwt);

  fastify.route<{
    Params: ParamsType;
  }>({
    url: '/:id',
    method: 'GET',
    schema: {
      params: ParamsSchema,
    },
    onRequest: jwt.verify.accessToken,
    async handler(req, reply) {
      const { id } = req.params;
      return service.getById(id);
    },
  });

  fastify.route<{
    Body: CreateSchema;
  }>({
    url: '',
    method: 'POST',
    schema: {
      body: BodySchema,
    },
    async handler(req, reply) {
      return service.create(req.body);
    },
  });
};

export default func;

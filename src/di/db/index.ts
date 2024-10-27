import fp from 'fastify-plugin';
import { Lifetime, asClass } from 'awilix';
import { UserRepo } from './repos/user.js';
import { Mongoose } from 'mongoose';
import { userSchema } from './schemas/user.js';
import { FastifyInstance } from 'fastify';

export const diDb = 'diDb';
const localDiMongoDb = 'localDiMongoDb';

export class Db {
  userRepos: UserRepo;
  mongoose: Mongoose;

  constructor(diContainer: { [localDiMongoDb]: Mongoose }) {
    this.mongoose = diContainer[localDiMongoDb];

    this.userRepos = new UserRepo(this.mongoose.model('User', userSchema));
  }
}

export default fp(
  async (fastify) => {
    const mongoose = new Mongoose();

    mongoose
      .connect(createDbUri(fastify))
      .then(() => {
        fastify.log.info('connected to db');
      })
      .catch(async (e) => {
        fastify.log.error(e);

        await fastify.close();
        await mongoose.disconnect();
        process.exit(1);
      });

    fastify.diContainer.register({
      [diDb]: asClass(Db, {
        lifetime: Lifetime.SINGLETON,
      }).inject(() => ({
        [localDiMongoDb]: mongoose,
      })),
    });
  },
  {
    name: diDb,
  },
);

function createDbUri(fastify: FastifyInstance) {
  if (fastify.config.NODE_ENV === 'local') {
    return `mongodb://${fastify.config.MONGODB_USER}:${fastify.config.MONGODB_PASSWORD}@localhost:3002/${fastify.config.MONGODB_DB_NAME}?serverSelectionTimeoutMS=2000&authSource=admin`;
  } else {
    return `mongodb://${fastify.config.MONGODB_USER}:${fastify.config.MONGODB_PASSWORD}@db:27017/${fastify.config.MONGODB_DB_NAME}?serverSelectionTimeoutMS=2000&authSource=admin`;
  }
}

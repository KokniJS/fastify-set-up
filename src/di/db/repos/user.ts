import { Model } from 'mongoose';
import { User } from '../schemas/user';

export class UserRepo {
  constructor(private model: Model<User>) {}

  async create(creationAttrs: User) {
    return this.model.create(creationAttrs);
  }

  async getById(id: string) {
    return this.model.findById({ _id: id });
  }
}

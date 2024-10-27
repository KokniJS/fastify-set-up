import { Schema, model } from 'mongoose';

export class User {
  _id?: string;
  name: string;
  age: number;
  createdAt?: Date;
}

export const userSchema = new Schema<User>({
  name: { type: String },
  age: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = model<User>('User', userSchema);

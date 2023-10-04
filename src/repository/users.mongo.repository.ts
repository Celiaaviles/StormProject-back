import createDebug from 'debug';
import { User } from '../entities/user.entities.js';
import { HttpError } from '../types/errors.js';
import { Repository } from './repository.js';
import { UserModel } from './users.mongo.model.js';
const debug = createDebug('CA:Repo:UsersMongoRepo');

export class UsersMongoRepository implements Repository<User> {
  constructor() {
    debug('Instantiated');
  }

  async getAll(): Promise<User[]> {
    const data = await UserModel.find().populate('storms', {}).exec();
    return data;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id).populate('storms', {}).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying getById',
      });
    return data;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<User[]> {
    const data = await UserModel.find({ [key]: value })
      .populate('storms')
      .exec();
    return data;
  }

  async create(newData: Partial<User>): Promise<User> {
    const newUser = await UserModel.create(newData);
    return newUser;
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, newData, {
      new: true,
    })
      .populate('storms', {})
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying update',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying delete',
      });
  }
}

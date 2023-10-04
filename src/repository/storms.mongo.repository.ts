import createDebug from 'debug';
import { Storm } from '../entities/storm.entities.js';
import { HttpError } from '../types/errors.js';
import { Repository } from './repository.js';
import { StormModel } from './storms.mongo.model.js';
const debug = createDebug('CA:Repo:UsersMongoRepo');

export class StormsMongoRepository implements Repository<Storm> {
  constructor() {
    debug('Instantiated');
  }

  async getAll(): Promise<Storm[]> {
    const data = await StormModel.find()
      .populate('owner', {
        userName: 1,
      })
      .exec();
    return data;
  }

  async getById(id: string): Promise<Storm> {
    const data = await StormModel.findById(id)
      .populate('owner', { userName: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Storm not found in file system', {
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
  }): Promise<Storm[]> {
    const data = await StormModel.find({ [key]: value })
      .populate('owner', {})
      .exec();
    return data;
  }

  async create(newData: Partial<Storm>): Promise<Storm> {
    const newStorm = await StormModel.create(newData);
    return newStorm;
  }

  async update(id: string, newData: Partial<Storm>): Promise<Storm> {
    const data = await StormModel.findByIdAndUpdate(id, newData, {
      new: true,
    })
      .populate('owner', { userName: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Storm not found in file system', {
        cause: 'Trying update',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await StormModel.findByIdAndDelete(id).exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'Storm not found in file system', {
        cause: 'Trying delete',
      });
  }
}

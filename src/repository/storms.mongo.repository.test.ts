import { StormNoId } from '../entities/storm.entities';
import { StormModel } from './storms.mongo.model';
import { StormsMongoRepository } from './storms.mongo.repository';

jest.mock('fs/promises');

describe('Given the class StormsMongoRepository', () => {
  describe('When we instance it', () => {
    const stormMockData = {
      id: '1',
      title: 'Storm',
      ubication: 'Asia',
      description: 'Storm in Asia',
    };
    const StormMockDataNoId = {
      title: 'Storm',
      ubication: 'Asia',
      description: 'Storm in Asia',
    } as unknown as StormNoId;

    StormModel.find = jest.fn().mockReturnValue({
      populate: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    });
    StormModel.findById = jest.fn().mockReturnValue({
      populate: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    });
    StormModel.create = jest.fn().mockReturnValue(stormMockData);
    StormModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      populate: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(stormMockData) }),
    });
    StormModel.findByIdAndDelete = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue('ok') });
    const repo = new StormsMongoRepository();
    test('Then getByIdAll should return data', async () => {
      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
    test('Then getById should return data', async () => {
      const result = await repo.getById('');
      expect(result).toEqual([]);
    });
    test('Then update should return data', async () => {
      const result = await repo.update(stormMockData.id, StormMockDataNoId);
      expect(result).toEqual(stormMockData);
    });
    test('Then delete should return data', async () => {
      const result = await repo.delete(stormMockData.id);
      expect(result).toEqual(undefined);
    });
    test('Then post should return data', async () => {
      const result = await repo.create(StormMockDataNoId);
      expect(result).toEqual(stormMockData);
    });
    test('Then search should return data', async () => {
      const result = await repo.search({ key: '', value: '' });
      expect(result).toEqual([]);
    });
  });
  describe('When i instance it', () => {
    const StormMockDataNoId = {
      id: '1',
      title: 'Storm',
      ubication: 'Asia',
      description: 'Storm in Asia',
    } as unknown as StormNoId;

    const repo = new StormsMongoRepository();
    test('Then getById should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      StormModel.findById = jest.fn().mockReturnValue({
        exec: mockExec,
      });
      expect(repo.getById('')).rejects.toThrow();
    });
    test('Then update should return error', async () => {
      const mockExecut = jest.fn().mockResolvedValue(null);
      StormModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: mockExecut,
      });
      expect(repo.update('', StormMockDataNoId)).rejects.toThrow();
    });
    test('Then delete should return error', async () => {
      const mockExecute = jest.fn().mockResolvedValue(null);
      StormModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: mockExecute,
      });
      expect(repo.delete('')).rejects.toThrow();
    });
  });
  describe('When i instance it', () => {
    test('toJSON method should transform the returned object', () => {
      const stormData = {
        username: 'testuser',
        password: 'password123',
      };
      const storm = new StormModel(stormData);
      const stormObject = storm.toJSON();
      expect(stormObject).not.toHaveProperty('_id');
      expect(stormObject).not.toHaveProperty('__v');
      expect(stormObject).not.toHaveProperty('password');
      expect(stormObject).toHaveProperty('id');
    });
  });
});

import { UserModel } from './users.mongo.model';
import { UsersMongoRepository } from './users.mongo.repository';

jest.mock('fs/promises');
describe('Given the class UsersMongoRepository', () => {
  describe('When i instance it', () => {
    const mockData = {
      id: '1',
      userName: 'Celia',
      email: 'celiavicaviles@gmail.com',
      passwd: '14Ce67',
      city: 'Asia',
      storms: [],
    };
    const mockDataNoId = {
      id: '1',
      userName: 'Celia',
      email: 'celiavicaviles@gmail.com',
      passwd: '14Ce67',
      city: 'Asia',
      storms: [],
    };
    UserModel.find = jest.fn().mockReturnValue({
      populate: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    });
    UserModel.findById = jest.fn().mockReturnValue({
      populate: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    });
    UserModel.create = jest.fn().mockReturnValue(mockData);
    UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      populate: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockData) }),
    });
    UserModel.findByIdAndDelete = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue('ok') });
    const repo = new UsersMongoRepository();
    test('Then getByIdAll should return data', async () => {
      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
    test('Then getById should return data', async () => {
      const result = await repo.getById('');
      expect(result).toEqual([]);
    });
    test('Then update should return data', async () => {
      const result = await repo.update(mockData.id, mockDataNoId);
      expect(result).toEqual(mockData);
    });
    test('Then delete should return data', async () => {
      const result = await repo.delete(mockData.id);
      expect(result).toEqual(undefined);
    });
    test('Then post should return data', async () => {
      const result = await repo.create(mockDataNoId);
      expect(result).toEqual(mockData);
    });
    test('Then search should return data', async () => {
      const result = await repo.search({ key: '', value: '' });
      expect(result).toEqual([]);
    });
  });
  describe('When i instance it', () => {
    const mockDataNoId = {
      id: '1',
      userName: 'Celia',
      email: 'celiavicaviles@gmail.com',
      passwd: '14Ce67',
      city: 'Asia',
      storms: [],
    };

    const repo = new UsersMongoRepository();
    test('Then getById should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      UserModel.findById = jest.fn().mockReturnValue({
        exec: mockExec,
      });
      expect(repo.getById('')).rejects.toThrow();
    });
    test('Then update should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: mockExec,
      });
      expect(repo.update('', mockDataNoId)).rejects.toThrow();
    });
    test('Then delete should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      UserModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: mockExec,
      });
      expect(repo.delete('')).rejects.toThrow();
    });
  });
  describe('When i instance it', () => {
    test('toJSON method should transform the returned object', () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
      };
      const user = new UserModel(userData);
      const userObject = user.toJSON();
      expect(userObject).not.toHaveProperty('_id');
      expect(userObject).not.toHaveProperty('__v');
      expect(userObject).not.toHaveProperty('password');
      expect(userObject).toHaveProperty('id');
    });
  });
});

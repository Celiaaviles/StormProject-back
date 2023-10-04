import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.entities.js';
import { Repository } from '../repository/repository.js';
import { Auth } from '../services/auth.js';
import { UsersController } from './users.controller.js';
describe('Givent the instantiate UsersController', () => {
  describe('When all is ok', () => {
    const mockNext = jest.fn() as NextFunction;

    const mockRepo: Repository<User> = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      search: jest.fn().mockResolvedValue([
        {
          userName: '',
          id: '',
        },
      ]),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockUsersController = new UsersController(mockRepo);

    test('Then if we use register method', async () => {
      const mockData = { id: 'test', userName: 'test' };
      (mockRepo.create as jest.Mock).mockReturnValue({
        id: 'test',
        userName: 'test',
      });
      const mockReq = {
        body: {
          passwd: 'test',
        },
      } as Request;
      const mockResponse = {
        status: Number,
        json: jest.fn(),
      } as unknown as Response;

      await mockUsersController.register(mockReq, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('Then if we use login method', async () => {
      Auth.compare = jest.fn().mockReturnValue(true);
      Auth.signJWT = jest.fn().mockResolvedValue('testToken');

      const mockReq = {
        body: {
          userName: 'test',
          passwd: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUsersController.login(mockReq, mockResponse, mockNext);
      expect(await mockRepo.search).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use login method and not find the userName', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValue([]);
      const mockReq = {
        body: {
          userName: 'test',
          passwd: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUsersController.login(mockReq, mockResponse, mockNext);
    });
    test('Then if we use login method, with not the correct passwd', async () => {
      Auth.compare = jest.fn().mockResolvedValue(false);

      const mockReq = {
        body: {
          userName: 'test',
          passwd: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUsersController.login(mockReq, mockResponse, mockNext);
    });
    test('Then if we use getAll method', async () => {
      const aData = [{ id: 'test', userName: 'test' }];

      (mockRepo.getAll as jest.Mock).mockResolvedValue(aData);
      const mockReq = {} as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUsersController.getAll(mockReq, mockResponse, mockNext);
      expect(mockRepo.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(aData);
    });
    test('Then if we use getById method', async () => {
      const mockData = { id: 'test', userName: 'test' };
      (mockRepo.getById as jest.Mock).mockResolvedValue(mockData);
      const mockReq = {
        params: { id: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUsersController.getById(mockReq, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('Then if we use update method', async () => {
      const mockData = { id: 'test', userName: 'test' };
      Auth.hash = jest.fn().mockReturnValue('hash');
      (mockRepo.update as jest.Mock).mockResolvedValue(mockData);
      const mockReq = {
        body: { passwd: 'test', validatedId: 'test' },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
        status: Number,
      } as unknown as Response;

      await mockUsersController.update(mockReq, mockResponse, mockNext);
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    describe('When are errors', () => {
      const mockNext = jest.fn() as NextFunction;

      const mockRepo: Repository<User> = {
        create: jest.fn().mockRejectedValue(new Error('Create Error')),
        getAll: jest.fn().mockRejectedValue(new Error('GetAll Error')),
        getById: jest.fn().mockRejectedValue(new Error('GetById Error')),
        search: jest.fn().mockRejectedValue(new Error('Search Error')),
        update: jest.fn().mockRejectedValue(new Error('Update Error')),
        delete: jest.fn().mockRejectedValue(new Error('Delete Error')),
      };
      const mockUsersController = new UsersController(mockRepo);
      test('Then if we use register, next should called with error', async () => {
        const mockReq = {
          body: {
            passwd: 'test',
          },
        } as Request;
        const mockResponse = {
          status: Number,
          json: jest.fn(),
        } as unknown as Response;

        await mockUsersController.register(mockReq, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith(new Error('Create Error'));
      });

      test('Then if we use login method,next should called with error', async () => {
        Auth.compare = jest.fn().mockReturnValue(true);
        Auth.signJWT = jest.fn().mockResolvedValue('testToken');

        const mockReq = {
          body: {
            userName: 'test',
            passwd: 'test',
          },
        } as Request;
        const mockResponse = {
          json: jest.fn(),
        } as unknown as Response;

        await mockUsersController.login(mockReq, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith(new Error('Create Error'));
      });
      test('Then if we use getAll method,next should called with error', async () => {
        const mockReq = {} as Request;
        const mockResponse = {} as unknown as Response;

        await mockUsersController.getAll(mockReq, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith(new Error('GetAll Error'));
      });
      test('Then if we use getById method,next should called with error', async () => {
        const mockReq = { params: { id: 'tets' } } as unknown as Request;
        const mockResponse = {} as unknown as Response;

        await mockUsersController.getById(mockReq, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new Error('GetById Error'));
      });
      test('Then if we use update method,next should called with error', async () => {
        const mockReq = {
          body: { passwd: 'test', validatedId: 'test' },
        } as unknown as Request;
        const mockResponse = {} as unknown as Response;

        await mockUsersController.update(mockReq, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new Error('Update Error'));
      });
    });
  });
});

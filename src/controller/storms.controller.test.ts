import { NextFunction, Request, Response } from 'express';
import { Storm } from '../entities/storm.entities';
import { StormsMongoRepository } from '../repository/storms.mongo.repository';
import { UsersMongoRepository } from '../repository/users.mongo.repository';
import { CloudinaryService } from '../services/media.files';
import { HttpError } from '../types/errors';
import { StormsController } from './storms.controller';

describe('Given StormsController', () => {
  describe('When we instantiate', () => {
    const mockData = {
      title: 'Storm',
      ubication: 'Asia',
      description: 'Storm in Asia',
    } as unknown as Storm;
    const mockRepo = {
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    } as unknown as StormsMongoRepository;

    let stormsController: StormsController;
    beforeEach(() => {
      stormsController = new StormsController(mockRepo);
    });
    const mockRequest = {
      params: {},
      body: { validatedId: '01', owner: 'Victor' },
    } as Request;
    const mockNext = jest.fn() as NextFunction;

    test('Then, call getAll method', async () => {
      (mockRepo.getAll as jest.Mock).mockResolvedValueOnce([mockData]);
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockData),
      } as unknown as Response;
      await stormsController.getAll(mockRequest, mockResponse, mockNext);

      expect(mockRepo.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([mockData]);
    });

    test('Then, call delete method ', async () => {
      (mockRepo.delete as jest.Mock).mockResolvedValueOnce({});
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      await stormsController.delete(mockRequest, mockResponse, mockNext);
      expect(mockRepo.delete).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then, call update method', async () => {
      (mockRepo.delete as jest.Mock).mockResolvedValueOnce(mockData);
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockData),
        status: jest.fn().mockReturnValue(200),
      } as unknown as Response;

      await stormsController.update(mockRequest, mockResponse, mockNext);

      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    test('Then, call create', async () => {
      mockRepo.create = jest.fn().mockResolvedValueOnce(mockData);
      const mockUser = {
        id: '01',
        storms: [],
      };
      UsersMongoRepository.prototype.getById = jest
        .fn()
        .mockResolvedValue(mockUser);
      UsersMongoRepository.prototype.update = jest.fn();

      const mockCreateRequest = {
        body: {
          title: 'Storm',
          ubication: 'Asia',
          description: 'Storm in Asia',
        },
        file: { filename: 'filename', destination: 'destination' },
      } as unknown as Request;
      const responseMock = {
        json: jest.fn(),
        status: 201,
      } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      CloudinaryService.prototype.uploadImage = jest
        .fn()
        .mockResolvedValue(mockRequest.body.images);

      await stormsController.create(mockCreateRequest, responseMock, mockNext);

      expect(mockRepo.create).toHaveBeenCalled();
      expect(UsersMongoRepository.prototype.update).toHaveBeenCalled();
      expect(responseMock.status).toEqual(201);
    });

    describe('When we instanciate it with errors', () => {
      const error = new HttpError(
        404,
        'Bad request',
        'Not conextion with repository'
      );

      let mockRepo: StormsMongoRepository;

      let stormsController: StormsController;
      beforeEach(() => {
        mockRepo = {
          update: jest.fn().mockRejectedValue(error),
        } as unknown as StormsMongoRepository;
        stormsController = new StormsController(mockRepo);
      });
      const mockNext = jest.fn() as NextFunction;

      test('Then, it should call update method and return error', async () => {
        const mockRequest = { file: {} } as Request;

        const mockResponse = {
          json: jest.fn().mockRejectedValue(mockData),
        } as unknown as Response;

        await stormsController.update(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalled();
      });

      test('Then, it should call register method and return error', async () => {
        const requestMock = {} as Request;

        const mockResponse = {} as unknown as Response;

        await stormsController.create(requestMock, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(error).toBeInstanceOf(HttpError);
      });
    });
  });
});

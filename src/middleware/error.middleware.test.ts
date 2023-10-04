import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { HttpError } from '../types/errors';
import { errorMiddleware } from './error.middleware';

describe('Given errorMiddleware', () => {
  const mockRequest = {} as unknown as Request;
  const mockNext = jest.fn();

  describe('When we call it', () => {
    test('then should be used with HttpError', () => {
      const mockError = new HttpError(400, 'Error Http');
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(404),
        json: jest.fn(),
      } as unknown as Response;
      errorMiddleware(mockError, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.statusMessage).toEqual(mockError.statusMessage);
    });
    test('then should be used with ValidationError', () => {
      const mockError = new mongoose.Error.ValidationError();
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn(),
        statusMessage: 'Bad Request',
      } as unknown as Response;
      errorMiddleware(mockError, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.statusMessage).toEqual('Bad Request');
    });
    test('then should be used with CastError option', () => {
      const mockError = new mongoose.Error.CastError('400', '', '');
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn(),
        statusMessage: 'Bad Request',
      } as unknown as Response;
      errorMiddleware(mockError, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.statusMessage).toEqual('Bad Request');
    });
    test('then should be used with Not accepted', () => {
      const mockError = new mongoose.mongo.MongoServerError({});
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn(),
        statusMessage: 'Not accepted',
      } as unknown as Response;
      errorMiddleware(mockError, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.statusMessage).toEqual('Not accepted');
    });
    test('else option', () => {
      const mockError = {
        status: 500,
        name: 'Error Test',
        message: 'Server error',
      };
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn().mockResolvedValueOnce(mockError),
        statusMessage: 'Bad request',
      } as unknown as Response;
      errorMiddleware(mockError, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.status);
    });
  });
});

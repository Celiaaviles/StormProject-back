import { Request, Response } from 'express';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/errors.js';
import { AuthInterceptor } from './auth.interceptor';

jest.mock('../services/auth.js');

describe('Given AuthInterceptor and instantiate it', () => {
  const interceptor = new AuthInterceptor();
  const mockResponse = {} as Response;
  const mockNext = jest.fn();
  describe('When authorization is used ', () => {
    test('it should be called without errors', () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue('Bearer soy_el_token'),
        body: {},
      } as unknown as Request;

      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({
        id: '1',
      });

      interceptor.authorization(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });
    test('it should be called with errors', () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue(''),
        body: {},
      } as unknown as Request;

      const mockError = new HttpError(
        498,
        'Invalid token',
        'No token provided'
      );

      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({
        id: '1',
      });

      interceptor.authorization(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('When authentication is used', () => {
    const authenticationMiddleware = interceptor.loginAuthentication;

    test('middleware should be called without error', async () => {
      const mockRequest = {
        params: {},
        body: {
          validatedId: 12,
        },
      } as Request;

      await authenticationMiddleware(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });

    test('middleware should be called WITH error', async () => {
      const mockRequest = {
        params: {},
        body: {
          validatedId: 10,
        },
      } as Request;

      await authenticationMiddleware(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('No token provided'));
    });
  });
});

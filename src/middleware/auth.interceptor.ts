import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { UsersMongoRepository } from '../repository/users.mongo.repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/errors.js';

const debug = createDebug('CA:Middleware:Auth.Interceptor');

debug('Loaded');

export class AuthInterceptor {
  authorization(req: Request, _res: Response, next: NextFunction) {
    debug('Call interceptor');
    try {
      const token = req.get('Authorization')?.split(' ')[1];
      if (!token) {
        throw new HttpError(498, 'Invalid token', 'No token provided');
      }

      const { id } = Auth.verifyJWTGettingPayload(token);
      req.body.validatedId = id;
      debug(id);
      next();
    } catch (error) {
      next(error);
    }
  }

  async loginAuthentication(req: Request, _res: Response, next: NextFunction) {
    const userID = req.body.validatedId;

    try {
      const usersRepo = new UsersMongoRepository();
      const user = await usersRepo.getById(userID);
      if (user.id !== userID) {
        throw new HttpError(403, 'Invalid authentication', 'Invalid user');
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}

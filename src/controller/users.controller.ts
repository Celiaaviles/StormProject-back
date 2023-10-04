import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.entities.js';
import { Repository } from '../repository/repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/errors.js';
import { TokenPayload } from '../types/token.js';
import { Controller } from './controller.js';
const debug = createDebug('CA:Controller:UsersController');

export class UsersController extends Controller<User> {
  constructor(protected repo: Repository<User>) {
    super(repo);
    debug('Instantiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { userName, passwd } = req.body;

    const error = new HttpError(401, 'UnAuthorized', 'Login unauthorized');
    try {
      if (!this.repo.search) return;

      const data = await this.repo.search({ key: 'userName', value: userName });
      if (!data.length) {
        throw error;
      }

      const user = data[0];
      if (!(await Auth.compare(passwd, user.passwd))) {
        throw error;
      }

      const payload: TokenPayload = {
        id: user.id,
        userName: user.userName,
      };
      const token = Auth.signJWT(payload);
      res.json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      debug('Creating new user');
      req.body.passwd = await Auth.hash(req.body.passwd);
      const data = await this.repo.create(req.body);
      res.status(201);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.passwd) {
        req.body.passwd = await Auth.hash(req.body.passwd);
      }

      const data = await this.repo.update(req.body.validatedId, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

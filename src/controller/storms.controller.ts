import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Storm } from '../entities/storm.entities.js';
import { Repository } from '../repository/repository.js';
import { UsersMongoRepository } from '../repository/users.mongo.repository.js';
import { CloudinaryService } from '../services/media.files.js';
import { HttpError } from '../types/errors.js';
import { Controller } from './controller.js';

const debug = createDebug('CA:loaded:stormsController');

export class StormsController extends Controller<Storm> {
  cloudinary: CloudinaryService;
  constructor(protected repository: Repository<Storm>) {
    super(repository);
    this.cloudinary = new CloudinaryService();
    debug('Instantiated');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      debug('Called create');
      if (!req.file) {
        throw new HttpError(400, 'Bad Request', 'Picture can not load');
      }

      const { validatedId } = req.body;
      const userRepo = new UsersMongoRepository();
      const user = await userRepo.getById(validatedId);
      req.body.owner = user.id;
      const finalPath = req.file.destination + '/' + req.file!.filename;
      const image = await this.cloudinary.uploadImage(finalPath);
      req.body.image = image;
      const finalStorm = await this.repo.create(req.body);

      user.storms.push(finalStorm);
      userRepo.update(user.id, user);
      res.status(201);
      res.json(finalStorm);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!this.repository.update) return;
      debug(req.body.validatedId, req.params, 'body y params');
      const updatedStorm = await this.repository.update(
        req.params.id,
        req.body
      );
      debug('updatedstorm', updatedStorm);
      res.status(200);
      res.json(updatedStorm);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.repository.delete(id);
      res.json({});
      res.status(204);
    } catch (error) {
      next(error);
    }
  }
}

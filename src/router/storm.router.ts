import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { StormsController } from '../controller/storms.controller.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { StormsMongoRepository } from '../repository/storms.mongo.repository.js';

const debug = createDebug('CA:Router:UsersRouter');
debug('Loaded');
const repo = new StormsMongoRepository();
const authInterceptor = new AuthInterceptor();
const stormController = new StormsController(repo);
const filesInterceptor = new FilesInterceptor();
export const stormRouter = createRouter();

stormRouter.get('/', stormController.getAll.bind(stormController));

stormRouter.get('/:id', stormController.getById.bind(stormController));

stormRouter.post(
  '/create',
  authInterceptor.authorization.bind(authInterceptor),
  filesInterceptor.singleFileStore('image').bind(filesInterceptor),
  stormController.create.bind(stormController)
);
stormRouter.patch(
  '/profile/:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.loginAuthentication.bind(authInterceptor),
  stormController.update.bind(stormController)
);

stormRouter.delete(
  '/profile:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.loginAuthentication.bind(authInterceptor),
  stormController.delete.bind(stormController)
);

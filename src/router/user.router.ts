import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { UsersController } from '../controller/users.controller.js';

import { UsersMongoRepository } from '../repository/users.mongo.repository.js';

const debug = createDebug('CA:Router:UsersRouter');
debug('Loaded');
const repo = new UsersMongoRepository();

const userController = new UsersController(repo);
export const userRouter = createRouter();

userRouter.get('/', userController.getAll.bind(userController));
userRouter.get('/:id', userController.getById.bind(userController));
userRouter.post('/register', userController.register.bind(userController));
userRouter.patch('/login', userController.login.bind(userController));

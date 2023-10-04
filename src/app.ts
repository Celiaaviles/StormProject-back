import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import morgan from 'morgan';
import { errorMiddleware } from './middleware/error.middleware.js';
import { stormRouter } from './router/storm.router.js';
import { userRouter } from './router/user.router.js';

const debug = createDebug('CA:App');

export const app = express();
debug('Started');

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

app.use('/users', userRouter);
app.use('/storms', stormRouter);

app.use(errorMiddleware);

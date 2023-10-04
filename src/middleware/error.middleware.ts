import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/errors.js';
const debug = createDebug('CA:Middleware:Error');

debug('Loaded');

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  debug('Error', error.message);

  if (error instanceof HttpError) {
    res.status(error.status);
    res.statusMessage = error.statusMessage;
    res.json({
      type: 'Error Http',
      status: res.statusCode,
      statusMessage: res.statusMessage,
      message: error.message,
    });
  } else {
    res.status(500);
    res.json({
      type: 'Error',
      message: error.message,
    });
  }
};

import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
const debug = createDebug('CA:Middleware:Files.Interceptor');

export class FilesInterceptor {
  constructor() {
    debug('Instantiated');
  }

  singleFileStore(fileName: string) {
    debug('Called multer');

    const storage = multer.diskStorage({
      destination: './uploads',
      filename(req, file, callback) {
        callback(null, file.originalname);
      },
    });

    const upload = multer({ storage });
    const middleware = upload.single(fileName);
    debug('Called multer 2');
    return (req: Request, res: Response, next: NextFunction) => {
      const prevBody = req.body;
      middleware(req, res, next);
      req.body = { ...prevBody, ...req.body };
    };
  }
}

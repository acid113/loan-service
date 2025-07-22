import { RequestHandler } from 'express';

export const middleware: RequestHandler = (req, res, next) => {
  console.log('Middleware executed');
  next();
};

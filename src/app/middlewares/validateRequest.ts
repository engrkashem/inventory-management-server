import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsyncRequest from '../utils/catchAsyncRequest';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsyncRequest(
    async (req: Request, res: Response, next: NextFunction) => {
      await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
      });
      // if data is ok, forward to controller by calling next()
      next();
    },
  );
};

export default validateRequest;

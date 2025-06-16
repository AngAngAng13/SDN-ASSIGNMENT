import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { EntityError } from '../models/Errors.js';

export const validateRequest = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
    cookies: req.cookies, 
  });

  if (!result.success) {
    const formattedErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.slice(1).join('.');
      formattedErrors[path] = issue.message;
    }
    return next(new EntityError({ errors: formattedErrors }));
    // dừng và properate lên 
  }

  if (result.data.body) req.body = result.data.body;
  if (result.data.query) req.query = result.data.query;
  if (result.data.params) req.params = result.data.params;
  if (result.data.cookies) req.cookies = result.data.cookies;
  
  return next();
};
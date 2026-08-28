import type {
  Request,
  Response,
  NextFunction,
} from "express";

import type { AnyObjectSchema } from "yup";

export function validateBody(schema: AnyObjectSchema) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validatedData = await schema.validate(
        req.body,
        {
          abortEarly: false,
          stripUnknown: true,
        }
      );

      req.body = validatedData;

      next();
    } catch (error) {
      next(error);
    }
  };
}
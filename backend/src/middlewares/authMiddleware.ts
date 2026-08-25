import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../types/AppError.js";
import { verifyAccessToken } from "../utils/token.js";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError("Bạn chưa đăng nhập", 401);
    }

    if (!authorization.startsWith("Bearer ")) {
      throw new AppError("Token không hợp lệ", 401);
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new AppError("Token không hợp lệ", 401);
    }

    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError("Token không hợp lệ hoặc đã hết hạn", 401)
    );
  }
}

export function authorize(...allowedRoles: string[]) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(
        new AppError("Bạn chưa đăng nhập", 401)
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Bạn không có quyền thực hiện chức năng này", 403)
      );
    }

    next();
  };
}
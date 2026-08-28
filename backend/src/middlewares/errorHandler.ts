import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { ValidationError } from "yup";

import { AppError } from "../types/AppError.js";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Lỗi validation từ Yup
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors:
        err.inner && err.inner.length > 0
          ? err.inner.map((error) => ({
              field: error.path,
              message: error.message,
            }))
          : [
              {
                field: err.path,
                message: err.message,
              },
            ],
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Lỗi không xác định
  console.error("ERROR:", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
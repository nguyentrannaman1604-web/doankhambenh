import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  suggestSpecialty,
} from "../services/aiService.js";

export async function suggest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { symptoms } = req.body;

    const result = await suggestSpecialty(symptoms);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
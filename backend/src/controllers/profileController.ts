import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  getMyProfile,
  updateMyProfile,
} from "../services/profileService.js";

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;

    const profile = await getMyProfile(userId);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}
export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;

    const profile = await updateMyProfile(
      userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}
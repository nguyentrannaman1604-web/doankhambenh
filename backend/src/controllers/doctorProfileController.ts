import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  getMyDoctorProfile,
  updateMyDoctorProfile,
} from "../services/doctorProfileService.js";



export async function getDoctorProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;

    const profile =
      await getMyDoctorProfile(userId);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDoctorProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;

    const profile =
      await updateMyDoctorProfile(
        userId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Cập nhật thông tin bác sĩ thành công",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}
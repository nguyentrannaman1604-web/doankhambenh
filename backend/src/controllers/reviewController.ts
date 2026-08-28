import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createReview,
  getDoctorReviews,
  updateReview,
} from "../services/reviewService.js";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const patientId = req.user!.userId;

    const review = await createReview(
      patientId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Đánh giá bác sĩ thành công",
      data: review,
    });
  } catch (error) {
    next(error);
  }
}

export async function getByDoctor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const doctorId = Number(req.params.doctorId);

    const reviews =
      await getDoctorReviews(doctorId);

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const patientId = req.user!.userId;
    const reviewId = Number(req.params.id);

    const review = await updateReview(
      patientId,
      reviewId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật đánh giá thành công",
      data: review,
    });
  } catch (error) {
    next(error);
  }
}
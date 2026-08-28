import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../services/doctorService.js";

import { AppError } from "../types/AppError.js";

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const specialtyId = req.query.specialtyId
      ? Number(req.query.specialtyId)
      : undefined;

    if (
      specialtyId !== undefined &&
      (!Number.isInteger(specialtyId) || specialtyId <= 0)
    ) {
      throw new AppError(
        "specialtyId không hợp lệ",
        400
      );
    }

    const doctors = await getDoctors(specialtyId);

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOne(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        "Doctor ID không hợp lệ",
        400
      );
    }

    const doctor = await getDoctorById(id);

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const doctor = await createDoctor(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Tạo bác sĩ thành công",
      data: doctor,
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
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        "Doctor ID không hợp lệ",
        400
      );
    }

    const doctor = await updateDoctor(
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật bác sĩ thành công",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        "Doctor ID không hợp lệ",
        400
      );
    }

    await deleteDoctor(id);

    return res.status(200).json({
      success: true,
      message: "Xóa bác sĩ thành công",
    });
  } catch (error) {
    next(error);
  }
}
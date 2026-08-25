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

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const specialtyId = req.query.specialtyId
      ? Number(req.query.specialtyId)
      : undefined;

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
    const doctor = await createDoctor(req.body);

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

    await deleteDoctor(id);

    return res.status(200).json({
      success: true,
      message: "Xóa bác sĩ thành công",
    });
  } catch (error) {
    next(error);
  }
}
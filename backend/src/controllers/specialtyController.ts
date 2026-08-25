import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  getSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} from "../services/specialtyService.js";

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const specialties = await getSpecialties();

    return res.status(200).json({
      success: true,
      data: specialties,
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

    const specialty = await getSpecialtyById(id);

    return res.status(200).json({
      success: true,
      data: specialty,
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
    const specialty = await createSpecialty(req.body);

    return res.status(201).json({
      success: true,
      message: "Tạo chuyên khoa thành công",
      data: specialty,
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

    const specialty = await updateSpecialty(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Cập nhật chuyên khoa thành công",
      data: specialty,
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

    await deleteSpecialty(id);

    return res.status(200).json({
      success: true,
      message: "Xóa chuyên khoa thành công",
    });
  } catch (error) {
    next(error);
  }
}
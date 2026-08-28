import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  getMySchedules,
  createMySchedule,
  updateMySchedule,
  toggleMySchedule,
  getMyBlockedSlots,
  createBlockedSlot,
  deleteBlockedSlot,
} from "../services/scheduleService.js";

export async function getSchedules(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await getMySchedules(
      req.user!.userId
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createSchedule(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await createMySchedule(
      req.user!.userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Tạo lịch làm việc thành công",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSchedule(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const scheduleId = Number(req.params.id);

    const data = await updateMySchedule(
      req.user!.userId,
      scheduleId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật lịch làm việc thành công",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleSchedule(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const scheduleId = Number(req.params.id);

    const data = await toggleMySchedule(
      req.user!.userId,
      scheduleId
    );

    return res.status(200).json({
      success: true,
      message: "Thay đổi trạng thái lịch thành công",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBlockedSlots(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await getMyBlockedSlots(
      req.user!.userId
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function blockSlot(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await createBlockedSlot(
      req.user!.userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Chặn khung giờ thành công",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeBlockedSlot(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    await deleteBlockedSlot(
      req.user!.userId,
      id
    );

    return res.status(200).json({
      success: true,
      message: "Xóa khung giờ đã chặn thành công",
    });
  } catch (error) {
    next(error);
  }
}
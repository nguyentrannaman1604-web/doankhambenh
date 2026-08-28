import prisma from "../lib/prisma.js";
import { AppError } from "../types/AppError.js";

interface ScheduleInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration?: number;
}

interface BlockSlotInput {
  startAt: string;
  endAt: string;
  reason?: string;
}

async function getDoctorByUserId(userId: number) {
  const doctor = await prisma.doctor.findUnique({
    where: {
      userId,
    },
  });

  if (!doctor) {
    throw new AppError("Không tìm thấy hồ sơ bác sĩ", 404);
  }

  return doctor;
}

export async function getMySchedules(userId: number) {
  const doctor = await getDoctorByUserId(userId);

  return prisma.workingSchedule.findMany({
    where: {
      doctorId: doctor.id,
    },
    orderBy: {
      dayOfWeek: "asc",
    },
  });
}

export async function createMySchedule(userId: number, input: ScheduleInput) {
  const doctor = await getDoctorByUserId(userId);

  if (input.dayOfWeek < 0 || input.dayOfWeek > 6) {
    throw new AppError("dayOfWeek phải từ 0 đến 6", 400);
  }

  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!timeRegex.test(input.startTime) || !timeRegex.test(input.endTime)) {
    throw new AppError("Thời gian phải có định dạng HH:mm", 400);
  }

  if (input.startTime >= input.endTime) {
    throw new AppError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc", 400);
  }

  const slotDuration = input.slotDuration ?? 30;

  if (slotDuration <= 0) {
    throw new AppError("Thời lượng mỗi slot phải lớn hơn 0", 400);
  }

  // Kiểm tra lịch làm việc bị trùng
  const existingSchedules = await prisma.workingSchedule.findMany({
    where: {
      doctorId: doctor.id,
      dayOfWeek: input.dayOfWeek,
      isActive: true,
    },
  });

  const hasOverlap = existingSchedules.some(
    (schedule) =>
      input.startTime < schedule.endTime && input.endTime > schedule.startTime,
  );

  if (hasOverlap) {
    throw new AppError("Khung giờ làm việc bị trùng với lịch hiện có", 409);
  }

  return prisma.workingSchedule.create({
    data: {
      doctorId: doctor.id,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      slotDuration,
      isActive: true,
    },
  });
}

export async function updateMySchedule(
  userId: number,
  scheduleId: number,
  input: Partial<ScheduleInput>,
) {
  const doctor = await getDoctorByUserId(userId);

  const schedule = await prisma.workingSchedule.findFirst({
    where: {
      id: scheduleId,
      doctorId: doctor.id,
    },
  });

  if (!schedule) {
    throw new AppError("Không tìm thấy lịch làm việc", 404);
  }

  const dayOfWeek = input.dayOfWeek ?? schedule.dayOfWeek;

  const startTime = input.startTime ?? schedule.startTime;

  const endTime = input.endTime ?? schedule.endTime;

  const slotDuration = input.slotDuration ?? schedule.slotDuration;

  if (dayOfWeek < 0 || dayOfWeek > 6) {
    throw new AppError("dayOfWeek phải từ 0 đến 6", 400);
  }

  if (startTime >= endTime) {
    throw new AppError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc", 400);
  }

  if (slotDuration <= 0) {
    throw new AppError("Thời lượng mỗi slot phải lớn hơn 0", 400);
  }

  return prisma.workingSchedule.update({
    where: {
      id: scheduleId,
    },
    data: {
      dayOfWeek,
      startTime,
      endTime,
      slotDuration,
    },
  });
}

export async function toggleMySchedule(userId: number, scheduleId: number) {
  const doctor = await getDoctorByUserId(userId);

  const schedule = await prisma.workingSchedule.findFirst({
    where: {
      id: scheduleId,
      doctorId: doctor.id,
    },
  });

  if (!schedule) {
    throw new AppError("Không tìm thấy lịch làm việc", 404);
  }

  return prisma.workingSchedule.update({
    where: {
      id: scheduleId,
    },
    data: {
      isActive: !schedule.isActive,
    },
  });
}

export async function createBlockedSlot(userId: number, input: BlockSlotInput) {
  const doctor = await getDoctorByUserId(userId);

  const startAt = new Date(input.startAt);
  const endAt = new Date(input.endAt);

  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    throw new AppError("Ngày giờ không hợp lệ", 400);
  }

  if (startAt >= endAt) {
    throw new AppError("Thời gian bắt đầu phải trước thời gian kết thúc", 400);
  }

  return prisma.blockedSlot.create({
    data: {
      doctorId: doctor.id,
      startAt,
      endAt,
      reason: input.reason,
    },
  });
}

export async function getMyBlockedSlots(userId: number) {
  const doctor = await getDoctorByUserId(userId);

  return prisma.blockedSlot.findMany({
    where: {
      doctorId: doctor.id,
    },
    orderBy: {
      startAt: "asc",
    },
  });
}

export async function deleteBlockedSlot(userId: number, blockedSlotId: number) {
  const doctor = await getDoctorByUserId(userId);

  const blockedSlot = await prisma.blockedSlot.findFirst({
    where: {
      id: blockedSlotId,
      doctorId: doctor.id,
    },
  });

  if (!blockedSlot) {
    throw new AppError("Không tìm thấy khung giờ đã chặn", 404);
  }

  await prisma.blockedSlot.delete({
    where: {
      id: blockedSlotId,
    },
  });
}

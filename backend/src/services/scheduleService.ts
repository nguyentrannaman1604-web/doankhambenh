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

interface VietnamDateTimeParts {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
  hour: number;
  minute: number;
  time: string;
  dateKey: string;
}

function getVietnamDateTimeParts(
  date: Date
): VietnamDateTimeParts {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "Asia/Ho_Chi_Minh",

        year: "numeric",
        month: "2-digit",
        day: "2-digit",

        weekday: "short",

        hour: "2-digit",
        minute: "2-digit",

        hourCycle: "h23",
      }
    );

  const parts =
    formatter.formatToParts(
      date
    );

  const values =
    Object.fromEntries(
      parts.map((part) => [
        part.type,
        part.value,
      ])
    );

  const weekdayMap: Record<
    string,
    number
  > = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const year =
    Number(values.year);

  const month =
    Number(values.month);

  const day =
    Number(values.day);

  const hour =
    Number(values.hour);

  const minute =
    Number(values.minute);

  const dayOfWeek =
    weekdayMap[
      values.weekday
    ];

  const hourText =
    String(hour).padStart(
      2,
      "0"
    );

  const minuteText =
    String(minute).padStart(
      2,
      "0"
    );

  const monthText =
    String(month).padStart(
      2,
      "0"
    );

  const dayText =
    String(day).padStart(
      2,
      "0"
    );

  return {
    year,
    month,
    day,
    dayOfWeek,
    hour,
    minute,

    time:
      `${hourText}:${minuteText}`,

    dateKey:
      `${year}-${monthText}-${dayText}`,
  };
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

  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    throw new AppError("Thời gian phải có định dạng HH:mm", 400);
  }

  if (startTime >= endTime) {
    throw new AppError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc", 400);
  }

  if (slotDuration <= 0) {
    throw new AppError("Thời lượng mỗi slot phải lớn hơn 0", 400);
  }

  const overlappingSchedule = await prisma.workingSchedule.findFirst({
    where: {
      doctorId: doctor.id,
      dayOfWeek,
      isActive: true,
      id: {
        not: scheduleId,
      },
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
    },
  });

  if (overlappingSchedule) {
    throw new AppError("Khung giờ làm việc bị trùng với lịch hiện có", 409);
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

export async function deleteMySchedule(userId: number, scheduleId: number) {
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

  await prisma.workingSchedule.delete({
    where: {
      id: scheduleId,
    },
  });
}

export async function createBlockedSlot(
  userId: number,
  input: BlockSlotInput
) {
  const doctor =
    await getDoctorByUserId(
      userId
    );

  const startAt =
    new Date(input.startAt);

  const endAt =
    new Date(input.endAt);

  if (
    Number.isNaN(
      startAt.getTime()
    ) ||
    Number.isNaN(
      endAt.getTime()
    )
  ) {
    throw new AppError(
      "Ngày giờ không hợp lệ",
      400
    );
  }

  if (startAt >= endAt) {
    throw new AppError(
      "Thời gian bắt đầu phải trước thời gian kết thúc",
      400
    );
  }

   const now =
    new Date();

  if (startAt <= now) {
    throw new AppError(
      "Không thể chặn thời gian trong quá khứ",
      400
    );
  }

    const oneHourLater =
    new Date(
      now.getTime() +
        60 * 60 * 1000
    );

  if (
    startAt <
    oneHourLater
  ) {
    throw new AppError(
      "Bạn phải chặn lịch trước ít nhất 1 giờ",
      400
    );
  }

  const startVN =
    getVietnamDateTimeParts(
      startAt
    );

  const endVN =
    getVietnamDateTimeParts(
      endAt
    );

   if (
    startVN.dateKey !==
    endVN.dateKey
  ) {
    throw new AppError(
      "Thời gian chặn phải nằm trong cùng một ngày",
      400
    );
  }

  const dayOfWeek =
    startVN.dayOfWeek;

  const startTime =
    startVN.time;

  const endTime =
    endVN.time;

  const workingSchedule =
    await prisma.workingSchedule.findFirst(
      {
        where: {
          doctorId:
            doctor.id,

          dayOfWeek,

          isActive: true,

          startTime: {
            lte: startTime,
          },

          endTime: {
            gte: endTime,
          },
        },
      }
    );

  if (!workingSchedule) {
    throw new AppError(
      "Bạn không có lịch làm việc trong khoảng thời gian này",
      400
    );
  }

  const conflictingAppointment =
    await prisma.appointment.findFirst(
      {
        where: {
          doctorId:
            doctor.id,

          status: {
            in: [
              "PENDING",
              "CONFIRMED",
            ],
          },

          startAt: {
            lt: endAt,
          },

          endAt: {
            gt: startAt,
          },
        },

        select: {
          id: true,
          startAt: true,
          endAt: true,
          status: true,
        },
      }
    );

  if (
    conflictingAppointment
  ) {
    throw new AppError(
      "Không thể chặn thời gian vì đã có lịch hẹn của bệnh nhân trong khoảng này",
      409
    );
  }
  const conflictingBlockedSlot =
    await prisma.blockedSlot.findFirst(
      {
        where: {
          doctorId:
            doctor.id,

          startAt: {
            lt: endAt,
          },

          endAt: {
            gt: startAt,
          },
        },

        select: {
          id: true,
        },
      }
    );

  if (
    conflictingBlockedSlot
  ) {
    throw new AppError(
      "Khoảng thời gian này đã bị chặn hoặc bị trùng với thời gian nghỉ khác",
      409
    );
  }

   return prisma.blockedSlot.create(
    {
      data: {
        doctorId:
          doctor.id,

        startAt,

        endAt,

        reason:
          input.reason,
      },
    }
  );
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

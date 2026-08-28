import prisma from "../lib/prisma.js";
import { AppError } from "../types/AppError.js";

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

function minutesToTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}`;
}

function createDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00+07:00`);
}

export async function getDoctorAvailability(
  doctorId: number,
  date: string
) {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!doctor) {
    throw new AppError("Không tìm thấy bác sĩ", 404);
  }

  const selectedDate = new Date(`${date}T00:00:00+07:00`);

  if (Number.isNaN(selectedDate.getTime())) {
    throw new AppError("Ngày không hợp lệ", 400);
  }

  const dayOfWeek = selectedDate.getDay();

  const schedules = await prisma.workingSchedule.findMany({
    where: {
      doctorId,
      dayOfWeek,
      isActive: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  if (schedules.length === 0) {
    return {
      doctorId,
      date,
      slots: [],
    };
  }

  const dayStart = new Date(`${date}T00:00:00+07:00`);
  const dayEnd = new Date(`${date}T23:59:59+07:00`);

  const blockedSlots = await prisma.blockedSlot.findMany({
    where: {
      doctorId,
      startAt: {
        lt: dayEnd,
      },
      endAt: {
        gt: dayStart,
      },
    },
  });

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      startAt: {
        gte: dayStart,
        lte: dayEnd,
      },
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
  });

  const slots: {
    start: string;
    end: string;
    startAt: Date;
    endAt: Date;
    available: boolean;
  }[] = [];

  for (const schedule of schedules) {
    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = timeToMinutes(schedule.endTime);

    for (
      let current = startMinutes;
      current + schedule.slotDuration <= endMinutes;
      current += schedule.slotDuration
    ) {
      const start = minutesToTime(current);
      const end = minutesToTime(
        current + schedule.slotDuration
      );

      const slotStart = createDateTime(date, start);
      const slotEnd = createDateTime(date, end);

      const isBlocked = blockedSlots.some((block) => {
        return (
          slotStart < block.endAt &&
          slotEnd > block.startAt
        );
      });

      const isBooked = appointments.some((appointment) => {
        return (
          slotStart < appointment.endAt &&
          slotEnd > appointment.startAt
        );
      });

      slots.push({
        start,
        end,
        startAt: slotStart,
        endAt: slotEnd,
        available: !isBlocked && !isBooked,
      });
    }
  }

  return {
    doctorId,
    date,
    slots,
  };
}
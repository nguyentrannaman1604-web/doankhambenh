import prisma from "../lib/prisma.js";
import { AppError } from "../types/AppError.js";

interface CreateAppointmentInput {
  doctorId: number;
  startAt: string;
  endAt: string;
  reason?: string;
}


interface AppointmentFilter {
  doctorId?: number;
  date?: string;
  status?: string;
}

export async function createAppointment(
  patientId: number,
  input: CreateAppointmentInput
) {
  const startAt = new Date(input.startAt);
  const endAt = new Date(input.endAt);

  if (
    Number.isNaN(startAt.getTime()) ||
    Number.isNaN(endAt.getTime())
  ) {
    throw new AppError(
      "Thời gian đặt lịch không hợp lệ",
      400
    );
  }

  if (startAt >= endAt) {
    throw new AppError(
      "Giờ bắt đầu phải trước giờ kết thúc",
      400
    );
  }

  if (startAt <= new Date()) {
    throw new AppError(
      "Không thể đặt lịch trong quá khứ",
      400
    );
  }

 
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: input.doctorId,
    },
  });

  if (!doctor) {
    throw new AppError(
      "Không tìm thấy bác sĩ",
      404
    );
  }

 
  const vnDate = new Date(
    startAt.toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    })
  );

  const dayOfWeek = vnDate.getDay();

  const hour = String(vnDate.getHours()).padStart(2, "0");
  const minute = String(vnDate.getMinutes()).padStart(2, "0");

  const startTime = `${hour}:${minute}`;

  const schedules = await prisma.workingSchedule.findMany({
    where: {
      doctorId: doctor.id,
      dayOfWeek,
      isActive: true,
    },
  });

  const matchingSchedule = schedules.find(
    (schedule) =>
      startTime >= schedule.startTime &&
      startTime < schedule.endTime
  );

  if (!matchingSchedule) {
    throw new AppError(
      "Thời gian này không nằm trong lịch làm việc của bác sĩ",
      400
    );
  }

 
  const durationMinutes =
    (endAt.getTime() - startAt.getTime()) / 60000;

  if (durationMinutes !== matchingSchedule.slotDuration) {
    throw new AppError(
      `Mỗi lịch khám phải kéo dài ${matchingSchedule.slotDuration} phút`,
      400
    );
  }

  const endVnDate = new Date(
    endAt.toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    })
  );

  const endTime =
    `${String(endVnDate.getHours()).padStart(2, "0")}:` +
    `${String(endVnDate.getMinutes()).padStart(2, "0")}`;

  if (endTime > matchingSchedule.endTime) {
    throw new AppError(
      "Lịch khám vượt quá giờ làm việc của bác sĩ",
      400
    );
  }

  const blockedSlot = await prisma.blockedSlot.findFirst({
    where: {
      doctorId: doctor.id,
      startAt: {
        lt: endAt,
      },
      endAt: {
        gt: startAt,
      },
    },
  });

  if (blockedSlot) {
    throw new AppError(
      "Bác sĩ không làm việc trong khung giờ này",
      409
    );
  }


  const existingAppointment =
    await prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,

        status: {
          in: ["PENDING", "CONFIRMED"],
        },

        startAt: {
          lt: endAt,
        },

        endAt: {
          gt: startAt,
        },
      },
    });

  if (existingAppointment) {
    throw new AppError(
      "Khung giờ này đã có bệnh nhân đặt",
      409
    );
  }

  // 8. Tạo lịch hẹn
  return prisma.appointment.create({
    data: {
      patientId,
      doctorId: doctor.id,
      startAt,
      endAt,
      reason: input.reason,
      status: "PENDING",
    },

    include: {
      doctor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },

          specialties: {
            include: {
              specialty: true,
            },
          },
        },
      },
    },
  });
}

export async function getMyAppointments(
  patientId: number
) {
  return prisma.appointment.findMany({
    where: {
      patientId,
    },

    include: {
      doctor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },

          specialties: {
            include: {
              specialty: true,
            },
          },
        },
      },
    },

    orderBy: {
      startAt: "desc",
    },
  });
}

export async function cancelMyAppointment(
  patientId: number,
  appointmentId: number
) {
  const appointment =
    await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId,
      },
    });

  if (!appointment) {
    throw new AppError(
      "Không tìm thấy lịch hẹn",
      404
    );
  }

  if (appointment.status === "CANCELLED") {
    throw new AppError(
      "Lịch hẹn này đã được hủy",
      400
    );
  }

  if (appointment.status === "COMPLETED") {
    throw new AppError(
      "Lịch hẹn đã khám xong, không thể hủy",
      400
    );
  }

  const now = new Date();

  const diffMilliseconds =
    appointment.startAt.getTime() - now.getTime();

  const diffHours =
    diffMilliseconds / (1000 * 60 * 60);

  if (diffHours < 2) {
    throw new AppError(
      "Bạn chỉ có thể hủy lịch trước giờ khám ít nhất 2 tiếng",
      400
    );
  }

  return prisma.appointment.update({
    where: {
      id: appointment.id,
    },

    data: {
      status: "CANCELLED",
    },
  });
}


export async function getDoctorAppointmentsByDate(
  userId: number,
  date: string
) {
  const doctor = await prisma.doctor.findUnique({
    where: {
      userId,
    },
  });

  if (!doctor) {
    throw new AppError(
      "Không tìm thấy hồ sơ bác sĩ",
      404
    );
  }

  const dayStart = new Date(
    `${date}T00:00:00+07:00`
  );

  const dayEnd = new Date(
    `${date}T23:59:59.999+07:00`
  );

  if (
    Number.isNaN(dayStart.getTime()) ||
    Number.isNaN(dayEnd.getTime())
  ) {
    throw new AppError(
      "Ngày không hợp lệ",
      400
    );
  }

  return prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,

      startAt: {
        gte: dayStart,
        lte: dayEnd,
      },

      status: {
        not: "CANCELLED",
      },
    },

    include: {
      patient: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          dateOfBirth: true,
        },
      },
    },

    orderBy: {
      startAt: "asc",
    },
  });
}

export async function completeAppointment(
  userId: number,
  appointmentId: number
) {
  const doctor = await prisma.doctor.findUnique({
    where: {
      userId,
    },
  });

  if (!doctor) {
    throw new AppError(
      "Không tìm thấy hồ sơ bác sĩ",
      404
    );
  }

  const appointment =
    await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: doctor.id,
      },
    });

  if (!appointment) {
    throw new AppError(
      "Không tìm thấy lịch hẹn",
      404
    );
  }

  if (appointment.status === "CANCELLED") {
    throw new AppError(
      "Lịch hẹn đã bị hủy",
      400
    );
  }

  if (appointment.status === "COMPLETED") {
    throw new AppError(
      "Lịch hẹn này đã hoàn thành",
      400
    );
  }

  return prisma.appointment.update({
    where: {
      id: appointment.id,
    },

    data: {
      status: "COMPLETED",
    },
  });
}


export async function getAllAppointments(
  filter: AppointmentFilter
) {
  const where: any = {};

  if (filter.doctorId) {
    where.doctorId = filter.doctorId;
  }

  if (filter.status) {
    where.status = filter.status;
  }

  if (filter.date) {
    where.startAt = {
      gte: new Date(
        `${filter.date}T00:00:00+07:00`
      ),

      lte: new Date(
        `${filter.date}T23:59:59.999+07:00`
      ),
    };
  }

  return prisma.appointment.findMany({
    where,

    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      doctor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },

    orderBy: {
      startAt: "desc",
    },
  });
}

export async function confirmAppointment(
  appointmentId: number
) {
  const appointment =
    await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

  if (!appointment) {
    throw new AppError(
      "Không tìm thấy lịch hẹn",
      404
    );
  }

  if (appointment.status !== "PENDING") {
    throw new AppError(
      "Chỉ lịch đang chờ mới có thể xác nhận",
      400
    );
  }

  return prisma.appointment.update({
    where: {
      id: appointmentId,
    },

    data: {
      status: "CONFIRMED",
    },
  });
}


export async function cancelAppointmentByStaff(
  appointmentId: number
) {
  const appointment =
    await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

  if (!appointment) {
    throw new AppError(
      "Không tìm thấy lịch hẹn",
      404
    );
  }

  if (appointment.status === "COMPLETED") {
    throw new AppError(
      "Không thể hủy lịch đã khám xong",
      400
    );
  }

  if (appointment.status === "CANCELLED") {
    throw new AppError(
      "Lịch hẹn đã được hủy trước đó",
      400
    );
  }

  return prisma.appointment.update({
    where: {
      id: appointmentId,
    },

    data: {
      status: "CANCELLED",
    },
  });
}
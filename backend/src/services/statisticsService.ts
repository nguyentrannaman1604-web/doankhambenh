import prisma from "../lib/prisma.js";
import { AppError } from "../types/AppError.js";

export async function getOverviewStatistics() {
  const [
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    totalDoctors,
    totalPatients,
    totalSpecialties,
  ] = await Promise.all([
    prisma.appointment.count(),

    prisma.appointment.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.appointment.count({
      where: {
        status: "CONFIRMED",
      },
    }),

    prisma.appointment.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.appointment.count({
      where: {
        status: "CANCELLED",
      },
    }),

    prisma.doctor.count(),

    prisma.user.count({
      where: {
        role: "PATIENT",
      },
    }),

    prisma.specialty.count(),
  ]);

  return {
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    totalDoctors,
    totalPatients,
    totalSpecialties,
  };
}

export async function getAppointmentsByDate(
  date: string
) {
  const startDate = new Date(
    `${date}T00:00:00+07:00`
  );

  const endDate = new Date(
    `${date}T23:59:59.999+07:00`
  );

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    throw new AppError(
      "Ngày không hợp lệ. Định dạng phải là YYYY-MM-DD",
      400
    );
  }

  const [
    total,
    pending,
    confirmed,
    completed,
    cancelled,
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        startAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),

    prisma.appointment.count({
      where: {
        startAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "PENDING",
      },
    }),

    prisma.appointment.count({
      where: {
        startAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "CONFIRMED",
      },
    }),

    prisma.appointment.count({
      where: {
        startAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "COMPLETED",
      },
    }),

    prisma.appointment.count({
      where: {
        startAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "CANCELLED",
      },
    }),
  ]);

  return {
    date,
    total,
    pending,
    confirmed,
    completed,
    cancelled,
  };
}

export async function getTopDoctors(
  limit: number = 5
) {
  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 20
  ) {
    throw new AppError(
      "limit phải từ 1 đến 20",
      400
    );
  }

  const grouped =
    await prisma.appointment.groupBy({
      by: ["doctorId"],

      where: {
        status: {
          in: [
            "PENDING",
            "CONFIRMED",
            "COMPLETED",
          ],
        },
      },

      _count: {
        id: true,
      },

      orderBy: {
        _count: {
          id: "desc",
        },
      },

      take: limit,
    });

  const result = await Promise.all(
    grouped.map(async (item) => {
      const doctor =
        await prisma.doctor.findUnique({
          where: {
            id: item.doctorId,
          },

          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },

            specialties: {
              include: {
                specialty: true,
              },
            },
          },
        });

      return {
        doctorId: item.doctorId,

        doctorName:
          doctor?.user.name ?? "Không xác định",

        rating:
          doctor?.rating ?? 0,

        specialties:
          doctor?.specialties.map(
            (item) => item.specialty.name
          ) ?? [],

        appointmentCount:
          item._count.id,
      };
    })
  );

  return result;
}
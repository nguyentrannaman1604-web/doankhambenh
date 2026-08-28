import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { AppError } from "../types/AppError.js";

interface CreateDoctorInput {
  name: string;
  email: string;
  password: string;

  phone?: string;
  dateOfBirth?: string;

  gender?: "MALE" | "FEMALE" | "OTHER";
  avatar?: string;

  experience?: number;
  bio?: string;

  specialtyIds: number[];
}

interface UpdateDoctorInput {
  name?: string;
  phone?: string;

  dateOfBirth?: string | null;

  // MỚI
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  avatar?: string | null;

  experience?: number;
  bio?: string;

  specialtyIds?: number[];
}

export async function getDoctors(specialtyId?: number) {
  return prisma.doctor.findMany({
    where: specialtyId
      ? {
          specialties: {
            some: {
              specialtyId,
            },
          },
        }
      : undefined,

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          dateOfBirth: true,

          // MỚI
          gender: true,
          avatar: true,
        },
      },

      specialties: {
        include: {
          specialty: true,
        },
      },
    },

    orderBy: {
      id: "asc",
    },
  });
}

export async function getDoctorById(id: number) {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          dateOfBirth: true,

          // MỚI
          gender: true,
          avatar: true,
        },
      },

      specialties: {
        include: {
          specialty: true,
        },
      },

      workingSchedules: {
        orderBy: {
          dayOfWeek: "asc",
        },
      },
    },
  });

  if (!doctor) {
    throw new AppError("Không tìm thấy bác sĩ", 404);
  }

  return doctor;
}

export async function createDoctor(input: CreateDoctorInput) {
  if (!input.specialtyIds?.length) {
    throw new AppError("Bác sĩ phải có ít nhất một chuyên khoa", 400);
  }

  // Kiểm tra gender
  if (
    input.gender !== undefined &&
    !["MALE", "FEMALE", "OTHER"].includes(input.gender)
  ) {
    throw new AppError("Giới tính không hợp lệ", 400);
  }

  let dateOfBirth: Date | null = null;

  if (input.dateOfBirth) {
    dateOfBirth = new Date(input.dateOfBirth);

    if (Number.isNaN(dateOfBirth.getTime())) {
      throw new AppError("Ngày sinh không hợp lệ", 400);
    }

    if (dateOfBirth > new Date()) {
      throw new AppError("Ngày sinh không được lớn hơn ngày hiện tại", 400);
    }
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email đã tồn tại", 409);
  }

  // Kiểm tra chuyên khoa
  const uniqueSpecialtyIds = [...new Set(input.specialtyIds)];

  const specialties = await prisma.specialty.findMany({
    where: {
      id: {
        in: uniqueSpecialtyIds,
      },
    },
  });

  if (specialties.length !== uniqueSpecialtyIds.length) {
    throw new AppError("Có chuyên khoa không tồn tại", 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(input.password, 10);

  const doctor = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,

        phone: input.phone,

        dateOfBirth,

        // MỚI
        gender: input.gender,
        avatar: input.avatar,

        role: "DOCTOR",
      },
    });

    const doctor = await tx.doctor.create({
      data: {
        userId: user.id,

        experience: input.experience ?? 0,

        bio: input.bio,
      },
    });

    await tx.doctorSpecialty.createMany({
      data: uniqueSpecialtyIds.map((specialtyId) => ({
        doctorId: doctor.id,
        specialtyId,
      })),
    });

    return tx.doctor.findUnique({
      where: {
        id: doctor.id,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            dateOfBirth: true,

            // MỚI
            gender: true,
            avatar: true,
          },
        },

        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
  });

  return doctor;
}

export async function updateDoctor(id: number, input: UpdateDoctorInput) {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!doctor) {
    throw new AppError("Không tìm thấy bác sĩ", 404);
  }

  if (
    input.gender !== undefined &&
    input.gender !== null &&
    !["MALE", "FEMALE", "OTHER"].includes(input.gender)
  ) {
    throw new AppError("Giới tính không hợp lệ", 400);
  }

  let dateOfBirth: Date | null | undefined;

  if (input.dateOfBirth === null) {
    dateOfBirth = null;
  } else if (input.dateOfBirth !== undefined) {
    dateOfBirth = new Date(input.dateOfBirth);

    if (Number.isNaN(dateOfBirth.getTime())) {
      throw new AppError("Ngày sinh không hợp lệ", 400);
    }

    if (dateOfBirth > new Date()) {
      throw new AppError("Ngày sinh không được lớn hơn ngày hiện tại", 400);
    }
  }

  if (input.specialtyIds) {
    if (input.specialtyIds.length === 0) {
      throw new AppError("Bác sĩ phải có ít nhất một chuyên khoa", 400);
    }

    const uniqueIds = [...new Set(input.specialtyIds)];

    const specialties = await prisma.specialty.findMany({
      where: {
        id: {
          in: uniqueIds,
        },
      },
    });

    if (specialties.length !== uniqueIds.length) {
      throw new AppError("Có chuyên khoa không tồn tại", 400);
    }

    input.specialtyIds = uniqueIds;
  }

  return prisma.$transaction(async (tx) => {
    // Update bảng User
    await tx.user.update({
      where: {
        id: doctor.userId,
      },

      data: {
        ...(input.name !== undefined && {
          name: input.name,
        }),

        ...(input.phone !== undefined && {
          phone: input.phone,
        }),

        ...(input.dateOfBirth !== undefined && {
          dateOfBirth,
        }),

        // MỚI
        ...(input.gender !== undefined && {
          gender: input.gender,
        }),

        // MỚI
        ...(input.avatar !== undefined && {
          avatar: input.avatar,
        }),
      },
    });

    // Update bảng Doctor
    await tx.doctor.update({
      where: {
        id,
      },

      data: {
        ...(input.experience !== undefined && {
          experience: input.experience,
        }),

        ...(input.bio !== undefined && {
          bio: input.bio,
        }),
      },
    });

    if (input.specialtyIds) {
      await tx.doctorSpecialty.deleteMany({
        where: {
          doctorId: id,
        },
      });

      await tx.doctorSpecialty.createMany({
        data: input.specialtyIds.map((specialtyId) => ({
          doctorId: id,
          specialtyId,
        })),
      });
    }

    return tx.doctor.findUnique({
      where: {
        id,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            dateOfBirth: true,

            // MỚI
            gender: true,
            avatar: true,
          },
        },

        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
  });
}

export async function deleteDoctor(id: number) {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!doctor) {
    throw new AppError("Không tìm thấy bác sĩ", 404);
  }

  const futureAppointments = await prisma.appointment.count({
    where: {
      doctorId: id,

      startAt: {
        gt: new Date(),
      },

      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
  });

  if (futureAppointments > 0) {
    throw new AppError("Không thể xóa bác sĩ đang có lịch hẹn sắp tới", 409);
  }

  await prisma.user.delete({
    where: {
      id: doctor.userId,
    },
  });
}

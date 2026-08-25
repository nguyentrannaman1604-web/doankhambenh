import prisma from "../lib/prisma.js";
import { AppError } from "../types/AppError.js";

interface CreateSpecialtyInput {
  name: string;
  description?: string;
}

interface UpdateSpecialtyInput {
  name?: string;
  description?: string;
}

export async function getSpecialties() {
  return prisma.specialty.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getSpecialtyById(id: number) {
  const specialty = await prisma.specialty.findUnique({
    where: {
      id,
    },
    include: {
      doctors: {
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
            },
          },
        },
      },
    },
  });

  if (!specialty) {
    throw new AppError("Không tìm thấy chuyên khoa", 404);
  }

  return specialty;
}

export async function createSpecialty(
  input: CreateSpecialtyInput
) {
  const existing = await prisma.specialty.findUnique({
    where: {
      name: input.name,
    },
  });

  if (existing) {
    throw new AppError("Tên chuyên khoa đã tồn tại", 409);
  }

  return prisma.specialty.create({
    data: {
      name: input.name,
      description: input.description,
    },
  });
}

export async function updateSpecialty(
  id: number,
  input: UpdateSpecialtyInput
) {
  const specialty = await prisma.specialty.findUnique({
    where: {
      id,
    },
  });

  if (!specialty) {
    throw new AppError("Không tìm thấy chuyên khoa", 404);
  }

  if (input.name && input.name !== specialty.name) {
    const existing = await prisma.specialty.findUnique({
      where: {
        name: input.name,
      },
    });

    if (existing) {
      throw new AppError("Tên chuyên khoa đã tồn tại", 409);
    }
  }

  return prisma.specialty.update({
    where: {
      id,
    },
    data: {
      name: input.name,
      description: input.description,
    },
  });
}

export async function deleteSpecialty(id: number) {
  const specialty = await prisma.specialty.findUnique({
    where: {
      id,
    },
    include: {
      doctors: true,
    },
  });

  if (!specialty) {
    throw new AppError("Không tìm thấy chuyên khoa", 404);
  }

  if (specialty.doctors.length > 0) {
    throw new AppError(
      "Không thể xóa chuyên khoa đang có bác sĩ",
      409
    );
  }

  await prisma.specialty.delete({
    where: {
      id,
    },
  });

  return {
    id,
  };
}
import prisma from "../lib/prisma.js";
import { AppError } from "../types/AppError.js";

interface UpdateProfileInput {
  name?: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  avatar?: string | null;
}



export async function getMyProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      gender: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(
      "Không tìm thấy thông tin người dùng",
      404
    );
  }

  return user;
}



export async function updateMyProfile(
  userId: number,
  input: UpdateProfileInput
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(
      "Không tìm thấy người dùng",
      404
    );
  }

  if (
    input.name !== undefined &&
    input.name.trim().length < 2
  ) {
    throw new AppError(
      "Tên phải có ít nhất 2 ký tự",
      400
    );
  }

  if (
    input.gender !== undefined &&
    input.gender !== null &&
    !["MALE", "FEMALE", "OTHER"].includes(input.gender)
  ) {
    throw new AppError(
      "Giới tính không hợp lệ",
      400
    );
  }

  let dateOfBirth: Date | null | undefined;

  if (input.dateOfBirth === null) {
    dateOfBirth = null;
  } else if (input.dateOfBirth !== undefined) {
    dateOfBirth = new Date(input.dateOfBirth);

    if (Number.isNaN(dateOfBirth.getTime())) {
      throw new AppError(
        "Ngày sinh không hợp lệ",
        400
      );
    }

    if (dateOfBirth > new Date()) {
      throw new AppError(
        "Ngày sinh không được lớn hơn ngày hiện tại",
        400
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      ...(input.name !== undefined && {
        name: input.name.trim(),
      }),

      ...(input.phone !== undefined && {
        phone: input.phone,
      }),

      ...(input.dateOfBirth !== undefined && {
        dateOfBirth,
      }),

      ...(input.gender !== undefined && {
        gender: input.gender,
      }),

      ...(input.avatar !== undefined && {
        avatar: input.avatar,
      }),
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      gender: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
}
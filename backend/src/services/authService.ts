import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { AppError } from "../types/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  avatar?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email đã tồn tại", 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,

      gender: input.gender,
      avatar: input.avatar,

      role: "PATIENT",
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
    },
  });

  return user;
}
export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new AppError("Email hoặc mật khẩu không đúng", 401);
  }

  const passwordMatched = await bcrypt.compare(input.password, user.password);

  if (!passwordMatched) {
    throw new AppError("Email hoặc mật khẩu không đúng", 401);
  }

  const payload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  if (!refreshToken) {
    throw new AppError("Refresh token là bắt buộc", 400);
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!storedToken) {
    throw new AppError("Refresh token không hợp lệ", 401);
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    throw new AppError("Refresh token đã hết hạn", 401);
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const accessToken = generateAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    return {
      accessToken,
    };
  } catch {
    throw new AppError("Refresh token không hợp lệ hoặc đã hết hạn", 401);
  }
}

export async function logoutUser(refreshToken: string) {
  if (!refreshToken) {
    throw new AppError("Refresh token là bắt buộc", 400);
  }

  await prisma.refreshToken.deleteMany({
    where: {
      token: refreshToken,
    },
  });
}

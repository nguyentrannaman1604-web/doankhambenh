import prisma from "../lib/prisma.js";
import { AppError } from "../types/AppError.js";

interface CreateReviewInput {
  appointmentId: number;
  rating: number;
  comment?: string;
}

interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export async function createReview(
  patientId: number,
  input: CreateReviewInput
) {
  
  if (
    !Number.isInteger(input.rating) ||
    input.rating < 1 ||
    input.rating > 5
  ) {
    throw new AppError(
      "Rating phải là số nguyên từ 1 đến 5",
      400
    );
  }

 
  const appointment =
    await prisma.appointment.findFirst({
      where: {
        id: input.appointmentId,
        patientId,
      },
    });

  if (!appointment) {
    throw new AppError(
      "Không tìm thấy lịch hẹn",
      404
    );
  }


  if (appointment.status !== "COMPLETED") {
    throw new AppError(
      "Chỉ có thể đánh giá sau khi đã khám xong",
      400
    );
  }

  const existingReview =
    await prisma.review.findUnique({
      where: {
        appointmentId: appointment.id,
      },
    });

  if (existingReview) {
    throw new AppError(
      "Lịch hẹn này đã được đánh giá",
      409
    );
  }

  return prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        appointmentId: appointment.id,
        patientId,
        doctorId: appointment.doctorId,
        rating: input.rating,
        comment: input.comment,
      },
    });

    const ratingResult = await tx.review.aggregate({
      where: {
        doctorId: appointment.doctorId,
      },
      _avg: {
        rating: true,
      },
    });

    const averageRating =
      ratingResult._avg.rating ?? 0;

    await tx.doctor.update({
      where: {
        id: appointment.doctorId,
      },
      data: {
        rating: averageRating,
      },
    });

    return review;
  });
}

export async function getDoctorReviews(
  doctorId: number
) {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!doctor) {
    throw new AppError(
      "Không tìm thấy bác sĩ",
      404
    );
  }

  return prisma.review.findMany({
    where: {
      doctorId,
    },

    include: {
      patient: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateReview(
  patientId: number,
  reviewId: number,
  input: UpdateReviewInput
) {
 
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new AppError(
      "Không tìm thấy đánh giá",
      404
    );
  }


  if (review.patientId !== patientId) {
    throw new AppError(
      "Bạn không có quyền sửa đánh giá này",
      403
    );
  }

  if (review.editCount >= 1) {
    throw new AppError(
      "Bạn chỉ được sửa đánh giá một lần",
      400
    );
  }


  if (
    input.rating === undefined &&
    input.comment === undefined
  ) {
    throw new AppError(
      "Bạn phải cung cấp rating hoặc comment cần sửa",
      400
    );
  }

 
  if (
    input.rating !== undefined &&
    (
      !Number.isInteger(input.rating) ||
      input.rating < 1 ||
      input.rating > 5
    )
  ) {
    throw new AppError(
      "Rating phải là số nguyên từ 1 đến 5",
      400
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: {
        id: reviewId,
      },

      data: {
        ...(input.rating !== undefined && {
          rating: input.rating,
        }),

        ...(input.comment !== undefined && {
          comment: input.comment,
        }),

      
        editCount: {
          increment: 1,
        },
      },
    });

   
    const ratingResult = await tx.review.aggregate({
      where: {
        doctorId: review.doctorId,
      },

      _avg: {
        rating: true,
      },
    });

    const averageRating =
      ratingResult._avg.rating ?? 0;

    await tx.doctor.update({
      where: {
        id: review.doctorId,
      },

      data: {
        rating: averageRating,
      },
    });

    return updatedReview;
  });
}
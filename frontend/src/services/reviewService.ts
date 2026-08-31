import api from "../api/axiosClient";

import type {
  CreateReviewInput,
  ReviewResponse,
  ReviewsResponse,
  UpdateReviewInput,
} from "../types/review";

export async function getDoctorReviews(
  doctorId: number
) {
  const response =
    await api.get<ReviewsResponse>(
      `/reviews/doctor/${doctorId}`
    );

  return response.data;
}

export async function createReview(
  data: CreateReviewInput
) {
  const response =
    await api.post<ReviewResponse>(
      "/reviews",
      data
    );

  return response.data;
}

export async function updateReview(
  reviewId: number,
  data: UpdateReviewInput
) {
  const response =
    await api.patch<ReviewResponse>(
      `/reviews/${reviewId}`,
      data
    );

  return response.data;
}
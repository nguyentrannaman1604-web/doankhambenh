export interface ReviewPatient {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  editCount: number;
  patient?: ReviewPatient;
}

export interface ReviewsResponse {
  success: boolean;
  message?: string;
  data: Review[];
}

export interface ReviewResponse {
  success: boolean;
  message?: string;
  data: Review;
}

export interface CreateReviewInput {
  appointmentId: number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}
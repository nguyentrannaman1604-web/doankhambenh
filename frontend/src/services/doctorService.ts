import api from "../api/axiosClient";

import type {
  Doctor,
  DoctorDetailResponse,
  AvailabilityResponse,
} from "../types/doctor";

interface DoctorListResponse {
  success: boolean;
  message?: string;
  data: Doctor[];
}



export async function getDoctors(
  specialtyId?: number
) {
  const response =
    await api.get<DoctorListResponse>(
      "/doctors",
      {
        params: specialtyId
          ? {
              specialtyId,
            }
          : undefined,
      }
    );

  return response.data;
}



export async function getDoctorById(
  doctorId: number
) {
  const response =
    await api.get<DoctorDetailResponse>(
      `/doctors/${doctorId}`
    );

  return response.data;
}



export async function getDoctorAvailability(
  doctorId: number,
  date: string
) {
  const response =
    await api.get<AvailabilityResponse>(
      `/doctors/${doctorId}/availability`,
      {
        params: {
          date,
        },
      }
    );

  return response.data;
}
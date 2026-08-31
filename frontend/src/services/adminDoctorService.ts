import api from "../api/axiosClient";

import type {
  Doctor,
  DoctorsResponse,
} from "../types/doctor";

export interface CreateDoctorInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  avatar?: string;
  experience: number;
  bio?: string;
  specialtyIds: number[];
}

export interface DoctorResponse {
  success: boolean;
  message?: string;
  data: Doctor;
}

export interface UpdateDoctorInput {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  avatar?: string;
  experience?: number;
  bio?: string;
  specialtyIds?: number[];
}

export async function getAdminDoctors() {
  const response =
    await api.get<DoctorsResponse>(
      "/doctors"
    );

  return response.data;
}

export async function createDoctor(
  data: CreateDoctorInput
) {
  const response =
    await api.post<DoctorResponse>(
      "/doctors",
      data
    );

  return response.data;
}

export async function deleteDoctor(
  doctorId: number
) {
  const response =
    await api.delete(
      `/doctors/${doctorId}`
    );

  return response.data;
}


export async function updateDoctor(
  doctorId: number,
  data: UpdateDoctorInput
) {
  const response =
    await api.patch<DoctorResponse>(
      `/doctors/${doctorId}`,
      data
    );

  return response.data;
}
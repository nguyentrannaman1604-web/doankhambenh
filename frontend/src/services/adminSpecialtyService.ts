import api from "../api/axiosClient";
import type {
  SpecialtiesResponse,
  SpecialtyResponse,
} from "../types/doctor";

export interface SpecialtyInput {
  name: string;
  description?: string;
}

export async function getAdminSpecialties() {
  const response =
    await api.get<SpecialtiesResponse>(
      "/specialties"
    );

  return response.data;
}

export async function createSpecialty(
  data: SpecialtyInput
) {
  const response =
    await api.post<SpecialtyResponse>(
      "/specialties",
      data
    );

  return response.data;
}

export async function updateSpecialty(
  specialtyId: number,
  data: SpecialtyInput
) {
  const response =
    await api.patch<SpecialtyResponse>(
      `/specialties/${specialtyId}`,
      data
    );

  return response.data;
}

export async function deleteSpecialty(
  specialtyId: number
) {
  const response =
    await api.delete(
      `/specialties/${specialtyId}`
    );

  return response.data;
}
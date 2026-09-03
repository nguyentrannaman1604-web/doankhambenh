import api from "../api/axiosClient";
import type {
  Specialty,
} from "../types/doctor";

interface SpecialtyResponse {
  success: boolean;
  message?: string;
  data: Specialty[];
}

export async function getSpecialties() {
  const response =
    await api.get<SpecialtyResponse>(
      "/specialties"
    );

  return response.data;
}
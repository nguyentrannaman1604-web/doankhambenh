import api from "../api/axiosClient";
import type {
  PatientProfileResponse,
} from "../types/patient";
import type {
  PatientProfileFormData,
} from "../schemas/patientSchema";

export async function getPatientProfile() {
  const response =
    await api.get<PatientProfileResponse>(
      "/profile"
    );

  return response.data;
}

export async function updatePatientProfile(
  data: PatientProfileFormData
) {
  const response =
    await api.patch<PatientProfileResponse>(
      "/profile",
      data
    );

  return response.data;
}
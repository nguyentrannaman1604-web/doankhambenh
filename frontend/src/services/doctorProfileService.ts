import api from "../api/axiosClient";

export interface DoctorProfileSpecialty {
  id: number;
  doctorId: number;
  specialtyId: number;

  specialty: {
    id: number;
    name: string;
    description?: string | null;
  };
}

export interface DoctorProfile {
  id: number;
  userId: number;
  experience?: number | null;
  bio?: string | null;

  user: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    dateOfBirth?: string | null;
    gender?: "MALE" | "FEMALE" | "OTHER" | null;
    avatar?: string | null;
    role: string;
  };

  specialties: DoctorProfileSpecialty[];
}

export interface DoctorProfileResponse {
  success: boolean;
  data: DoctorProfile;
  message?: string;
}

export interface UpdateDoctorProfileInput {
  name?: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  avatar?: string | null;
  bio?: string | null;
}

export async function getDoctorProfile(): Promise<DoctorProfileResponse> {
  const response =
    await api.get<DoctorProfileResponse>(
      "/doctor/profile"
    );

  return response.data;
}

export async function updateDoctorProfile(
  data: UpdateDoctorProfileInput
): Promise<DoctorProfileResponse> {
  const response =
    await api.patch<DoctorProfileResponse>(
      "/doctor/profile",
      data
    );

  return response.data;
}
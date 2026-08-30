export interface Specialty {
  id: number;
  name: string;
  description?: string | null;
}

export interface DoctorSpecialty {
  specialty: Specialty;
}

export interface DoctorUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  avatar?: string | null;
}

export interface Doctor {
  id: number;
  userId: number;
  experience: number | null;
  bio: string | null;
  user: DoctorUser;
  specialties: DoctorSpecialty[];
}

export interface DoctorDetailResponse {
  success: boolean;
  message?: string;
  data: Doctor;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  startAt: string;
  endAt: string;
  available: boolean;
}

export interface AvailabilityData {
  doctorId: number;
  date: string;
  slots: AvailabilitySlot[];
}

export interface AvailabilityResponse {
  success: boolean;
  message?: string;
  data: AvailabilityData;
}
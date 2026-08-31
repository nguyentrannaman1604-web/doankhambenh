export interface Specialty {
  id: number;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  rating: string | null;
}

export interface DoctorDetailResponse {
  success: boolean;
  message?: string;
  data: Doctor;
}

export interface DoctorsResponse {
  success: boolean;
  message?: string;
  data: Doctor[];
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

export interface AdminDoctorFormData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  avatar?: string;
  experience: number;
  bio?: string;
  specialtyIds: number[];
}

export interface SpecialtiesResponse {
  success: boolean;
  message?: string;
  data: Specialty[];
}

export interface SpecialtyResponse {
  success: boolean;
  message?: string;
  data: Specialty;
}
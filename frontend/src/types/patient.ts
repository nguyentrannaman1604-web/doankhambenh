export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

export interface PatientProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender: Gender | null;
  avatar: string | null;
}

export interface PatientProfileResponse {
  success: boolean;
  message?: string;
  data: PatientProfile;
}
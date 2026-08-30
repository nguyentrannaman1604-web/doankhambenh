export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface AppointmentDoctorUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar?: string | null;
}

export interface AppointmentDoctor {
  id: number;
  userId: number;
  user: AppointmentDoctorUser;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
  doctor?: AppointmentDoctor;
}

export interface CreateAppointmentInput {
  doctorId: number;
  startAt: string;
  endAt: string;
}

export interface CreateAppointmentResponse {
  success: boolean;
  message?: string;
  data: Appointment;
}

export interface MyAppointmentsResponse {
  success: boolean;
  message?: string;
  data: Appointment[];
}
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


export interface DoctorAppointmentPatient {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  dateOfBirth: string | null;
}

export interface DoctorDailyAppointment {
  id: number;
  patientId: number;
  doctorId: number;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  patient: DoctorAppointmentPatient;
}

export interface DoctorDailyAppointmentsResponse {
  success: boolean;
  message?: string;
  data: DoctorDailyAppointment[];
}


export interface AdminAppointmentPatient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface AdminAppointmentDoctorUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface AdminAppointmentDoctor {
  id: number;
  userId: number;
  experience: number | null;
  bio: string | null;
  rating: string | null;
  createdAt: string;
  updatedAt: string;
  user: AdminAppointmentDoctorUser;
}

export interface AdminAppointment {
  id: number;
  patientId: number;
  doctorId: number;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  patient: AdminAppointmentPatient;
  doctor: AdminAppointmentDoctor;
}

export interface AdminAppointmentsResponse {
  success: boolean;
  message?: string;
  data: AdminAppointment[];
}
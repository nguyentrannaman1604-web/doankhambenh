export interface AdminOverviewData {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalDoctors: number;
  totalPatients: number;
  totalSpecialties: number;
}

export interface AdminOverviewResponse {
  success: boolean;
  data: AdminOverviewData;
}

export interface AppointmentsByDateData {
  date: string;
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface AppointmentsByDateResponse {
  success: boolean;
  data: AppointmentsByDateData;
}

export interface TopDoctor {
  doctorId: number;
  doctorName: string;
  rating: string;
  specialties: string[];
  appointmentCount: number;
}

export interface TopDoctorsResponse {
  success: boolean;
  data: TopDoctor[];
}
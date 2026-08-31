import api from "../api/axiosClient";

import type {
  CreateAppointmentInput,
  CreateAppointmentResponse,
  MyAppointmentsResponse,
} from "../types/appointment";

import type { DoctorDailyAppointmentsResponse } from "../types/appointment";

export async function createAppointment(data: CreateAppointmentInput) {
  const response = await api.post<CreateAppointmentResponse>(
    "/appointments",
    data,
  );

  return response.data;
}

export async function getMyAppointments() {
  const response = await api.get<MyAppointmentsResponse>("/appointments/my");

  return response.data;
}

export async function cancelMyAppointment(appointmentId: number) {
  const response = await api.patch(`/appointments/${appointmentId}/cancel`);

  return response.data;
}

export async function getDoctorDailyAppointments(date: string) {
  const response = await api.get<DoctorDailyAppointmentsResponse>(
    "/appointments/doctor/daily",
    {
      params: {
        date,
      },
    },
  );

  return response.data;
}

export async function completeAppointment(appointmentId: number) {
  const response = await api.patch(`/appointments/${appointmentId}/complete`);

  return response.data;
}

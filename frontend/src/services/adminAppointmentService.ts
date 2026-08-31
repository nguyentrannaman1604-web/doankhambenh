import api from "../api/axiosClient";

import type {
  AdminAppointmentsResponse,
} from "../types/appointment";

export async function getAllAppointments() {
  const response =
    await api.get<AdminAppointmentsResponse>(
      "/appointments/admin/all"
    );

  return response.data;
}

export async function confirmAppointment(
  appointmentId: number
) {
  const response =
    await api.patch(
      `/appointments/${appointmentId}/confirm`
    );

  return response.data;
}

export async function staffCancelAppointment(
  appointmentId: number
) {
  const response =
    await api.patch(
      `/appointments/${appointmentId}/staff-cancel`
    );

  return response.data;
}
import api from "../api/axiosClient";

import type {
  AdminOverviewResponse,
  AppointmentsByDateResponse,
  TopDoctorsResponse,
} from "../types/adminStatistics";

export async function getAdminOverview() {
  const response =
    await api.get<AdminOverviewResponse>(
      "/admin/statistics/overview"
    );

  return response.data;
}

export async function getAppointmentsByDate(
  date: string
) {
  const response =
    await api.get<AppointmentsByDateResponse>(
      "/admin/statistics/appointments-by-date",
      {
        params: {
          date,
        },
      }
    );

  return response.data;
}

export async function getTopDoctors(
  limit = 5
) {
  const response =
    await api.get<TopDoctorsResponse>(
      "/admin/statistics/top-doctors",
      {
        params: {
          limit,
        },
      }
    );

  return response.data;
}
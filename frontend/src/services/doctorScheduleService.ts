import api from "../api/axiosClient";

import type {
  BlockedSlotsResponse,
  CreateBlockedSlotInput,
  CreateBlockedSlotResponse,
  DoctorSchedulesResponse,
} from "../types/schedule";

export async function getMyDoctorSchedules() {
  const response =
    await api.get<DoctorSchedulesResponse>(
      "/doctor/schedules"
    );

  return response.data;
}

export async function getMyBlockedSlots() {
  const response =
    await api.get<BlockedSlotsResponse>(
      "/doctor/schedules/blocked-slots"
    );

  return response.data;
}

export async function createBlockedSlot(
  data: CreateBlockedSlotInput
) {
  const response =
    await api.post<CreateBlockedSlotResponse>(
      "/doctor/schedules/blocked-slots",
      data
    );

  return response.data;
}

export async function deleteBlockedSlot(
  blockedSlotId: number
) {
  const response =
    await api.delete(
      `/doctor/schedules/blocked-slots/${blockedSlotId}`
    );

  return response.data;
}
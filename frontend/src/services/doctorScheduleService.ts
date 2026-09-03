import api from "../api/axiosClient";
import type {
  DoctorSchedulesResponse,
  DoctorScheduleResponse,
  CreateDoctorScheduleInput,
  UpdateDoctorScheduleInput,
  BlockedSlotsResponse,
  CreateBlockedSlotInput,
  CreateBlockedSlotResponse,
} from "../types/schedule";

export const getMyDoctorSchedules =
  async (): Promise<DoctorSchedulesResponse> => {
    const response =
      await api.get<DoctorSchedulesResponse>(
        "/doctor/schedules"
      );

    return response.data;
  };

export const createDoctorSchedule =
  async (
    data: CreateDoctorScheduleInput
  ): Promise<DoctorScheduleResponse> => {
    const response =
      await api.post<DoctorScheduleResponse>(
        "/doctor/schedules",
        data
      );

    return response.data;
  };

export const updateDoctorSchedule =
  async (
    id: number,
    data: UpdateDoctorScheduleInput
  ): Promise<DoctorScheduleResponse> => {
    const response =
      await api.patch<DoctorScheduleResponse>(
        `/doctor/schedules/${id}`,
        data
      );

    return response.data;
  };

export const toggleDoctorSchedule =
  async (
    id: number
  ): Promise<DoctorScheduleResponse> => {
    const response =
      await api.patch<DoctorScheduleResponse>(
        `/doctor/schedules/${id}/toggle`
      );

    return response.data;
  };

export const deleteDoctorSchedule =
  async (id: number): Promise<void> => {
    await api.delete(
      `/doctor/schedules/${id}`
    );
  };

export const getMyBlockedSlots =
  async (): Promise<BlockedSlotsResponse> => {
    const response =
      await api.get<BlockedSlotsResponse>(
        "/doctor/schedules/blocked-slots"
      );

    return response.data;
  };

export const createBlockedSlot =
  async (
    data: CreateBlockedSlotInput
  ): Promise<CreateBlockedSlotResponse> => {
    const response =
      await api.post<CreateBlockedSlotResponse>(
        "/doctor/schedules/blocked-slots",
        data
      );

    return response.data;
  };

export const deleteBlockedSlot =
  async (id: number): Promise<void> => {
    await api.delete(
      `/doctor/schedules/blocked-slots/${id}`
    );
  };
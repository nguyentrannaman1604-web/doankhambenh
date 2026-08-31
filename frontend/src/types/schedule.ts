export interface DoctorSchedule {
  id: number;
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSchedulesResponse {
  success: boolean;
  message?: string;
  data: DoctorSchedule[];
}

export interface BlockedSlot {
  id: number;
  doctorId: number;
  startAt: string;
  endAt: string;
  reason: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlockedSlotsResponse {
  success: boolean;
  message?: string;
  data: BlockedSlot[];
}

export interface CreateBlockedSlotInput {
  startAt: string;
  endAt: string;
  reason?: string;
}

export interface CreateBlockedSlotResponse {
  success: boolean;
  message?: string;
  data: BlockedSlot;
}
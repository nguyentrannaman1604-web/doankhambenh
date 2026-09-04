import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import dayjs from "dayjs";

import {
  blockedSlotSchema,
  type BlockedSlotFormData,
} from "../../schemas/blockedSlotSchema";

import type { BlockedSlot, DoctorSchedule } from "../../types/schedule";

import {
  createBlockedSlot,
  deleteBlockedSlot,
  getMyBlockedSlots,
  getMyDoctorSchedules,
} from "../../services/doctorScheduleService";

function BlockedSlotSection() {
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);

  const [workingSchedules, setWorkingSchedules] = useState<DoctorSchedule[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlockedSlotFormData>({
    resolver: yupResolver(blockedSlotSchema),

    defaultValues: {
      date: dayjs().format("YYYY-MM-DD"),
      startTime: "",
      endTime: "",
      reason: "",
    },
  });

  const selectedDate = watch("date");

  const loadBlockedSlots = async () => {
    try {
      const response = await getMyBlockedSlots();

      setBlockedSlots(response.data);
    } catch (error) {
      console.error("Load blocked slots error:", error);

      throw error;
    }
  };

  const loadWorkingSchedules = async () => {
    try {
      const response = await getMyDoctorSchedules();

      setWorkingSchedules(response.data);
    } catch (error) {
      console.error("Load working schedules error:", error);

      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([loadBlockedSlots(), loadWorkingSchedules()]);
      } catch (error) {
        console.error("Load blocked slot section error:", error);

        setError("Không thể tải dữ liệu lịch làm việc");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedDaySchedules = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    const selectedDay = dayjs(selectedDate).day();

    return workingSchedules
      .filter(
        (schedule) => schedule.dayOfWeek === selectedDay && schedule.isActive,
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [selectedDate, workingSchedules]);

  const minimumStartTime =
    selectedDate === dayjs().format("YYYY-MM-DD")
      ? dayjs().add(1, "hour").format("HH:mm")
      : undefined;

  const onSubmit = async (data: BlockedSlotFormData) => {
    try {
      setError("");
      setSuccess("");

      const startDateTime = new Date(`${data.date}T${data.startTime}:00`);

      const endDateTime = new Date(`${data.date}T${data.endTime}:00`);

      if (
        Number.isNaN(startDateTime.getTime()) ||
        Number.isNaN(endDateTime.getTime())
      ) {
        setError("Ngày giờ không hợp lệ");

        return;
      }

      if (startDateTime >= endDateTime) {
        setError("Thời gian bắt đầu phải trước thời gian kết thúc");

        return;
      }

      const now = new Date();

      if (startDateTime <= now) {
        setError("Không thể chặn thời gian trong quá khứ");

        return;
      }

      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      if (startDateTime < oneHourLater) {
        setError("Bạn phải chặn lịch trước ít nhất 1 giờ");

        return;
      }

      const selectedDay = dayjs(data.date).day();

      const activeSchedules = workingSchedules.filter(
        (schedule) => schedule.dayOfWeek === selectedDay && schedule.isActive,
      );

      if (activeSchedules.length === 0) {
        setError("Bạn không có lịch làm việc trong ngày này");

        return;
      }

      const isInsideWorkingSchedule = activeSchedules.some(
        (schedule) =>
          schedule.startTime <= data.startTime &&
          schedule.endTime >= data.endTime,
      );

      if (!isInsideWorkingSchedule) {
        setError("Khoảng thời gian chặn phải nằm trong giờ làm việc của bạn");

        return;
      }

      const startAt = startDateTime.toISOString();

      const endAt = endDateTime.toISOString();

      await createBlockedSlot({
        startAt,
        endAt,
        reason: data.reason || undefined,
      });

      setSuccess("Chặn thời gian thành công");

      reset({
        date: data.date,
        startTime: "",
        endTime: "",
        reason: "",
      });

      await loadBlockedSlots();
    } catch (error: any) {
      console.error("Create blocked slot error:", error);

      setError(error.response?.data?.message || "Không thể chặn thời gian");
    }
  };

  const handleDelete = async (blockedSlotId: number) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa thời gian đã chặn này không?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(blockedSlotId);

      setError("");
      setSuccess("");

      await deleteBlockedSlot(blockedSlotId);

      setSuccess("Xóa thời gian đã chặn thành công");

      await loadBlockedSlots();
    } catch (error: any) {
      console.error("Delete blocked slot error:", error);

      setError(
        error.response?.data?.message || "Không thể xóa thời gian đã chặn",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box
      sx={{
        mt: 5,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 1,
        }}
      >
        Thời gian bận / nghỉ
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          mb: 3,
        }}
      >
        Chặn khoảng thời gian không nhận lịch khám từ bệnh nhân.
      </Typography>

      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
          }}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {error}
        </Alert>
      )}

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Chặn thời gian
        </Typography>

        <Alert
          severity="info"
          sx={{
            mb: 3,
          }}
        >
          Chỉ được chặn trong giờ làm việc của bạn và phải báo trước ít nhất 1
          giờ. Nếu đã có bệnh nhân đặt lịch trong khoảng này, hệ thống sẽ không
          cho phép chặn.
        </Alert>

        {selectedDate && selectedDaySchedules.length === 0 && (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
            }}
          >
            Bạn không có lịch làm việc trong ngày đã chọn.
          </Alert>
        )}

        {selectedDate && selectedDaySchedules.length > 0 && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
            }}
          >
            Lịch làm việc ngày này:{" "}
            <strong>
              {selectedDaySchedules
                .map(
                  (schedule) => `${schedule.startTime} - ${schedule.endTime}`,
                )
                .join(", ")}
            </strong>
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",

              md: "repeat(3, 1fr)",
            },

            gap: 2,
          }}
        >
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ngày"
                type="date"
                required
                error={!!errors.date}
                helperText={errors.date?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },

                  htmlInput: {
                    min: dayjs().format("YYYY-MM-DD"),
                  },
                }}
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              />
            )}
          />

          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Giờ bắt đầu"
                type="time"
                required
                error={!!errors.startTime}
                helperText={errors.startTime?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },

                  htmlInput: {
                    min: minimumStartTime,
                  },
                }}
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              />
            )}
          />

          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Giờ kết thúc"
                type="time"
                required
                error={!!errors.endTime}
                helperText={errors.endTime?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              />
            )}
          />

          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Lý do"
                placeholder="Ví dụ: Họp, việc cá nhân..."
                error={!!errors.reason}
                helperText={errors.reason?.message}
                sx={{
                  gridColumn: {
                    xs: "auto",
                    md: "span 2",
                  },
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || selectedDaySchedules.length === 0}
            sx={{
              textTransform: "none",

              minHeight: 56,
            }}
          >
            {isSubmitting ? "Đang xử lý..." : "Chặn thời gian"}
          </Button>
        </Box>
      </Paper>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Thời gian đã chặn
      </Typography>

      {loading ? (
        <Box
          sx={{
            py: 4,
            textAlign: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : blockedSlots.length === 0 ? (
        <Alert severity="info">Chưa có khoảng thời gian nào được chặn.</Alert>
      ) : (
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {blockedSlots.map((blockedSlot, index) => (
            <Box key={blockedSlot.id}>
              <Box
                sx={{
                  p: 3,

                  display: "flex",

                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },

                  justifyContent: "space-between",

                  alignItems: {
                    xs: "flex-start",
                    md: "center",
                  },

                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,

                      mb: 0.5,
                    }}
                  >
                    {dayjs(blockedSlot.startAt).format("DD/MM/YYYY")}
                  </Typography>

                  <Typography>
                    {dayjs(blockedSlot.startAt).format("HH:mm")}

                    {" - "}

                    {dayjs(blockedSlot.endAt).format("HH:mm")}
                  </Typography>

                  <Typography
                    sx={{
                      color: "text.secondary",

                      mt: 0.5,
                    }}
                  >
                    Lý do: {blockedSlot.reason || "Không có"}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  color="error"
                  disabled={deletingId === blockedSlot.id}
                  onClick={() => handleDelete(blockedSlot.id)}
                  sx={{
                    textTransform: "none",
                  }}
                >
                  {deletingId === blockedSlot.id ? "Đang xóa..." : "Xóa chặn"}
                </Button>
              </Box>

              {index < blockedSlots.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}

export default BlockedSlotSection;

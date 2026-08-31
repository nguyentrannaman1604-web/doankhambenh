import {
  useEffect,
  useState,
} from "react";

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

import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  yupResolver,
} from "@hookform/resolvers/yup";

import dayjs from "dayjs";

import {
  blockedSlotSchema,
  type BlockedSlotFormData,
} from "../../schemas/blockedSlotSchema";

import type {
  BlockedSlot,
} from "../../types/schedule";

import {
  createBlockedSlot,
  deleteBlockedSlot,
  getMyBlockedSlots,
} from "../../services/doctorScheduleService";

function BlockedSlotSection() {
  const [
    blockedSlots,
    setBlockedSlots,
  ] = useState<BlockedSlot[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    deletingId,
    setDeletingId,
  ] = useState<number | null>(
    null
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<BlockedSlotFormData>({
    resolver: yupResolver(
      blockedSlotSchema
    ),

    defaultValues: {
      date: dayjs().format(
        "YYYY-MM-DD"
      ),
      startTime: "",
      endTime: "",
      reason: "",
    },
  });

  const loadBlockedSlots =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getMyBlockedSlots();

        setBlockedSlots(
          response.data
        );
      } catch (error) {
        console.error(
          "Load blocked slots error:",
          error
        );

        setError(
          "Không thể tải thời gian đã chặn"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadBlockedSlots();
  }, []);

  const onSubmit = async (
    data: BlockedSlotFormData
  ) => {
    try {
      setError("");
      setSuccess("");

      /*
       * Tạo Date theo giờ local của trình duyệt.
       * toISOString() chuyển sang UTC trước
       * khi gửi cho backend.
       */
      const startAt = new Date(
        `${data.date}T${data.startTime}:00`
      ).toISOString();

      const endAt = new Date(
        `${data.date}T${data.endTime}:00`
      ).toISOString();

      await createBlockedSlot({
        startAt,
        endAt,
        reason:
          data.reason || undefined,
      });

      setSuccess(
        "Chặn thời gian thành công"
      );

      reset({
        date: data.date,
        startTime: "",
        endTime: "",
        reason: "",
      });

      await loadBlockedSlots();
    } catch (error: any) {
      console.error(
        "Create blocked slot error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Không thể chặn thời gian"
      );
    }
  };

  const handleDelete =
    async (
      blockedSlotId: number
    ) => {
      const confirmed =
        window.confirm(
          "Bạn có chắc muốn xóa thời gian đã chặn này không?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          blockedSlotId
        );

        setError("");
        setSuccess("");

        await deleteBlockedSlot(
          blockedSlotId
        );

        setSuccess(
          "Xóa thời gian đã chặn thành công"
        );

        await loadBlockedSlots();
      } catch (error: any) {
        console.error(
          "Delete blocked slot error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Không thể xóa thời gian đã chặn"
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
          color:
            "text.secondary",
          mb: 3,
        }}
      >
        Chặn khoảng thời gian
        không nhận lịch khám từ
        bệnh nhân.
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
            mb: 3,
          }}
        >
          Chặn thời gian
        </Typography>

        <Box
          component="form"
          onSubmit={
            handleSubmit(
              onSubmit
            )
          }
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md:
                "repeat(3, 1fr)",
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
                error={
                  !!errors.date
                }
                helperText={
                  errors.date
                    ?.message
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={{
                  "& .MuiFormLabel-asterisk":
                    {
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
                error={
                  !!errors.startTime
                }
                helperText={
                  errors.startTime
                    ?.message
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={{
                  "& .MuiFormLabel-asterisk":
                    {
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
                error={
                  !!errors.endTime
                }
                helperText={
                  errors.endTime
                    ?.message
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={{
                  "& .MuiFormLabel-asterisk":
                    {
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
                error={
                  !!errors.reason
                }
                helperText={
                  errors.reason
                    ?.message
                }
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
            disabled={
              isSubmitting
            }
            sx={{
              textTransform:
                "none",
              minHeight: 56,
            }}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : "Chặn thời gian"}
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
      ) : blockedSlots.length ===
        0 ? (
        <Alert severity="info">
          Chưa có khoảng thời gian
          nào được chặn.
        </Alert>
      ) : (
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {blockedSlots.map(
            (
              blockedSlot,
              index
            ) => (
              <Box
                key={
                  blockedSlot.id
                }
              >
                <Box
                  sx={{
                    p: 3,
                    display:
                      "flex",
                    flexDirection: {
                      xs: "column",
                      md: "row",
                    },
                    justifyContent:
                      "space-between",
                    alignItems: {
                      xs:
                        "flex-start",
                      md: "center",
                    },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight:
                          700,
                        mb: 0.5,
                      }}
                    >
                      {dayjs(
                        blockedSlot.startAt
                      ).format(
                        "DD/MM/YYYY"
                      )}
                    </Typography>

                    <Typography>
                      {dayjs(
                        blockedSlot.startAt
                      ).format(
                        "HH:mm"
                      )}

                      {" - "}

                      {dayjs(
                        blockedSlot.endAt
                      ).format(
                        "HH:mm"
                      )}
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          "text.secondary",
                        mt: 0.5,
                      }}
                    >
                      Lý do:{" "}
                      {blockedSlot.reason ||
                        "Không có"}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    color="error"
                    disabled={
                      deletingId ===
                      blockedSlot.id
                    }
                    onClick={() =>
                      handleDelete(
                        blockedSlot.id
                      )
                    }
                    sx={{
                      textTransform:
                        "none",
                    }}
                  >
                    {deletingId ===
                    blockedSlot.id
                      ? "Đang xóa..."
                      : "Xóa chặn"}
                  </Button>
                </Box>

                {index <
                  blockedSlots.length -
                    1 && (
                  <Divider />
                )}
              </Box>
            )
          )}
        </Paper>
      )}
    </Box>
  );
}

export default BlockedSlotSection;
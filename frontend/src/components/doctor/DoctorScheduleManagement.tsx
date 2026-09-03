import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import axios from "axios";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import {
  doctorScheduleSchema,
  type DoctorScheduleFormData,
} from "../../schemas/doctorScheduleSchema";

import {
  createDoctorSchedule,
  deleteDoctorSchedule,
  getMyDoctorSchedules,
  toggleDoctorSchedule,
  updateDoctorSchedule,
} from "../../services/doctorScheduleService";

import type { DoctorSchedule } from "../../types/schedule";

const dayNames: Record<number, string> = {
  0: "Chủ nhật",
  1: "Thứ hai",
  2: "Thứ ba",
  3: "Thứ tư",
  4: "Thứ năm",
  5: "Thứ sáu",
  6: "Thứ bảy",
};

function DoctorScheduleManagement() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);

  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingSchedule, setEditingSchedule] = useState<DoctorSchedule | null>(
    null,
  );

  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState(false);

  const [deletingSchedule, setDeletingSchedule] =
    useState<DoctorSchedule | null>(null);

  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DoctorScheduleFormData>({
    resolver: yupResolver(doctorScheduleSchema),

    defaultValues: {
      dayOfWeek: 1,
      startTime: "08:00",
      endTime: "17:00",
      slotDuration: 30,
    },
  });

  const loadSchedules = async () => {
    try {
      setLoading(true);

      const response = await getMyDoctorSchedules();

      setSchedules(response.data);
    } catch (error) {
      console.error("Load schedules error:", error);

      setSuccess(false);

      setMessage("Không thể tải lịch làm việc");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleOpenCreate = () => {
    setEditingSchedule(null);

    reset({
      dayOfWeek: 1,
      startTime: "08:00",
      endTime: "17:00",
      slotDuration: 30,
    });

    setDialogOpen(true);
  };

  const handleOpenEdit = (schedule: DoctorSchedule) => {
    setEditingSchedule(schedule);

    reset({
      dayOfWeek: schedule.dayOfWeek,

      startTime: schedule.startTime,

      endTime: schedule.endTime,

      slotDuration: schedule.slotDuration,
    });

    setDialogOpen(true);
  };

  const onSubmit = async (data: DoctorScheduleFormData) => {
    try {
      setMessage("");

      if (editingSchedule) {
        await updateDoctorSchedule(editingSchedule.id, data);

        setSuccess(true);

        setMessage("Cập nhật lịch làm việc thành công");
      } else {
        await createDoctorSchedule(data);

        setSuccess(true);

        setMessage("Tạo lịch làm việc thành công");
      }

      setDialogOpen(false);

      await loadSchedules();
    } catch (error: unknown) {
      console.error("Save schedule error:", error);

      setSuccess(false);

      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message || "Không thể lưu lịch làm việc",
        );
      } else {
        setMessage("Không thể lưu lịch làm việc");
      }
    }
  };

  const handleToggle = async (schedule: DoctorSchedule) => {
    try {
      await toggleDoctorSchedule(schedule.id);

      setSuccess(true);

      setMessage(
        schedule.isActive
          ? `Đã tắt lịch ${dayNames[schedule.dayOfWeek]}`
          : `Đã bật lịch ${dayNames[schedule.dayOfWeek]}`,
      );

      await loadSchedules();
    } catch (error: unknown) {
      console.error("Toggle schedule error:", error);

      setSuccess(false);

      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message || "Không thể thay đổi trạng thái lịch",
        );
      } else {
        setMessage("Không thể thay đổi trạng thái lịch");
      }
    }
  };

  const handleDeleteSchedule = async () => {
    if (!deletingSchedule) {
      return;
    }

    try {
      setDeleting(true);

      setMessage("");

      await deleteDoctorSchedule(deletingSchedule.id);

      setSuccess(true);

      setMessage(
        `Đã xóa lịch ${dayNames[deletingSchedule.dayOfWeek]} ${deletingSchedule.startTime} - ${deletingSchedule.endTime}`,
      );

      setDeletingSchedule(null);

      await loadSchedules();
    } catch (error: unknown) {
      console.error("Delete schedule error:", error);

      setSuccess(false);

      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message || "Không thể xóa lịch làm việc",
        );
      } else {
        setMessage("Không thể xóa lịch làm việc");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: {
            xs: "stretch",
            sm: "center",
          },

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          gap: 2,

          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            Lịch làm việc hàng tuần
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",

              mt: 0.5,
            }}
          >
            Quản lý ngày, giờ làm việc và thời lượng mỗi lượt khám.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            textTransform: "none",

            alignSelf: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          Thêm lịch làm việc
        </Button>
      </Box>

      {message && (
        <Alert
          severity={success ? "success" : "error"}
          sx={{
            mb: 2,
          }}
        >
          {message}
        </Alert>
      )}

      {loading ? (
        <Typography>Đang tải lịch...</Typography>
      ) : schedules.length === 0 ? (
        <Alert severity="info">Bạn chưa có lịch làm việc.</Alert>
      ) : (
        <Stack spacing={2}>
          {schedules
            .slice()
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            .map((schedule) => (
              <Paper
                key={schedule.id}
                variant="outlined"
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                  },

                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: {
                      xs: "flex-start",
                      sm: "center",
                    },

                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },

                    gap: 2,
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: 1,

                        flexWrap: "wrap",

                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,

                          fontSize: 18,
                        }}
                      >
                        {dayNames[schedule.dayOfWeek]}
                      </Typography>

                      <Chip
                        size="small"
                        label={schedule.isActive ? "Đang hoạt động" : "Đã tắt"}
                        color={schedule.isActive ? "success" : "default"}
                      />
                    </Box>

                    <Typography>
                      Giờ làm: <strong>{schedule.startTime}</strong>
                      {" - "}
                      <strong>{schedule.endTime}</strong>
                    </Typography>

                    <Typography
                      sx={{
                        color: "text.secondary",

                        mt: 0.5,
                      }}
                    >
                      Mỗi lượt khám: {schedule.slotDuration} phút
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",

                      alignItems: "center",

                      gap: 1,

                      flexWrap: "wrap",

                      width: {
                        xs: "100%",
                        sm: "auto",
                      },
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEdit(schedule)}
                      sx={{
                        textTransform: "none",

                        flex: {
                          xs: 1,
                          sm: "none",
                        },
                      }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeletingSchedule(schedule)}
                      sx={{
                        textTransform: "none",

                        flex: {
                          xs: 1,
                          sm: "none",
                        },
                      }}
                    >
                      Xóa
                    </Button>

                    <Box
                      sx={{
                        display: "flex",

                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          mr: 0.5,
                        }}
                      >
                        {schedule.isActive ? "Bật" : "Tắt"}
                      </Typography>

                      <Switch
                        checked={schedule.isActive}
                        onChange={() => handleToggle(schedule)}
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))}
        </Stack>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle
            sx={{
              fontWeight: 700,
            }}
          >
            {editingSchedule ? "Sửa lịch làm việc" : "Thêm lịch làm việc"}
          </DialogTitle>

          <DialogContent>
            <TextField
              select
              label="Ngày làm việc"
              fullWidth
              margin="normal"
              {...register("dayOfWeek")}
              error={!!errors.dayOfWeek}
              helperText={errors.dayOfWeek?.message}
            >
              <MenuItem value={1}>Thứ hai</MenuItem>

              <MenuItem value={2}>Thứ ba</MenuItem>

              <MenuItem value={3}>Thứ tư</MenuItem>

              <MenuItem value={4}>Thứ năm</MenuItem>

              <MenuItem value={5}>Thứ sáu</MenuItem>

              <MenuItem value={6}>Thứ bảy</MenuItem>

              <MenuItem value={0}>Chủ nhật</MenuItem>
            </TextField>

            <TextField
              label="Giờ bắt đầu"
              type="time"
              fullWidth
              margin="normal"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              {...register("startTime")}
              error={!!errors.startTime}
              helperText={errors.startTime?.message}
            />

            <TextField
              label="Giờ kết thúc"
              type="time"
              fullWidth
              margin="normal"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              {...register("endTime")}
              error={!!errors.endTime}
              helperText={errors.endTime?.message}
            />

            <TextField
              label="Thời lượng mỗi lượt khám"
              type="number"
              fullWidth
              margin="normal"
              {...register("slotDuration")}
              error={!!errors.slotDuration}
              helperText={errors.slotDuration?.message || "Đơn vị: phút"}
            />

            <Alert
              severity="info"
              sx={{
                mt: 2,
              }}
            >
              Hệ thống đang dành thời gian nghỉ trưa từ 12:00 đến 13:00, nên các
              slot khám sẽ không được tạo trong khoảng này.
            </Alert>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
            }}
          >
            <Button
              onClick={() => setDialogOpen(false)}
              sx={{
                textTransform: "none",
              }}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                textTransform: "none",
              }}
            >
              {isSubmitting
                ? "Đang lưu..."
                : editingSchedule
                  ? "Lưu thay đổi"
                  : "Tạo lịch"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={deletingSchedule !== null}
        onClose={() => {
          if (!deleting) {
            setDeletingSchedule(null);
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Xóa lịch làm việc
        </DialogTitle>

        <DialogContent>
          <Alert
            severity="warning"
            sx={{
              mb: 2,
            }}
          >
            Lịch làm việc sau khi xóa sẽ không thể khôi phục.
          </Alert>

          {deletingSchedule && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {dayNames[deletingSchedule.dayOfWeek]}
              </Typography>

              <Typography>
                Giờ làm: <strong>{deletingSchedule.startTime}</strong>
                {" - "}
                <strong>{deletingSchedule.endTime}</strong>
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  mt: 0.5,
                }}
              >
                Mỗi lượt khám: {deletingSchedule.slotDuration} phút
              </Typography>
            </Paper>
          )}

          <Typography
            sx={{
              mt: 2,
            }}
          >
            Bạn có chắc muốn xóa lịch làm việc này không?
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={() => setDeletingSchedule(null)}
            disabled={deleting}
            sx={{
              textTransform: "none",
            }}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSchedule}
            disabled={deleting}
            sx={{
              textTransform: "none",
            }}
          >
            {deleting ? "Đang xóa..." : "Xóa lịch"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DoctorScheduleManagement;

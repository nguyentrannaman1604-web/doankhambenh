import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import dayjs from "dayjs";

import type {
  AdminAppointment,
  AppointmentStatus,
} from "../../types/appointment";

import {
  confirmAppointment,
  getAllAppointments,
  staffCancelAppointment,
} from "../../services/adminAppointmentService";

function AdminAppointmentsPage() {
  const [
    appointments,
    setAppointments,
  ] = useState<AdminAppointment[]>([]);

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("");

  const [
    dateFilter,
    setDateFilter,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionId,
    setActionId,
  ] = useState<number | null>(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const loadAppointments =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAllAppointments();

        setAppointments(
          response.data
        );
      } catch (error) {
        console.error(
          "Load admin appointments error:",
          error
        );

        setError(
          "Không thể tải danh sách lịch hẹn"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments =
    useMemo(() => {
      return appointments.filter(
        (appointment) => {
          const matchStatus =
            !statusFilter ||
            appointment.status ===
              statusFilter;

          const appointmentDate =
            dayjs(
              appointment.startAt
            ).format(
              "YYYY-MM-DD"
            );

          const matchDate =
            !dateFilter ||
            appointmentDate ===
              dateFilter;

          return (
            matchStatus &&
            matchDate
          );
        }
      );
    }, [
      appointments,
      statusFilter,
      dateFilter,
    ]);

  const handleConfirm =
    async (
      appointmentId: number
    ) => {
      const confirmed =
        window.confirm(
          "Xác nhận lịch hẹn này?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionId(
          appointmentId
        );

        setError("");
        setSuccess("");

        await confirmAppointment(
          appointmentId
        );

        setSuccess(
          "Xác nhận lịch hẹn thành công"
        );

        await loadAppointments();
      } catch (error: any) {
        console.error(
          "Confirm appointment error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Không thể xác nhận lịch hẹn"
        );
      } finally {
        setActionId(null);
      }
    };

  const handleCancel =
    async (
      appointmentId: number
    ) => {
      const confirmed =
        window.confirm(
          "Bạn có chắc muốn hủy lịch hẹn này?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionId(
          appointmentId
        );

        setError("");
        setSuccess("");

        await staffCancelAppointment(
          appointmentId
        );

        setSuccess(
          "Hủy lịch hẹn thành công"
        );

        await loadAppointments();
      } catch (error: any) {
        console.error(
          "Staff cancel error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Không thể hủy lịch hẹn"
        );
      } finally {
        setActionId(null);
      }
    };

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Quản lý lịch hẹn
        </Typography>

        <Typography
          sx={{
            color:
              "text.secondary",
          }}
        >
          Theo dõi và xử lý lịch
          khám tại PHÒNG KHÁM
          PANDA.
        </Typography>
      </Box>

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            select
            label="Trạng thái"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            sx={{
              minWidth: 200,
            }}
          >
            <MenuItem value="">
              Tất cả trạng thái
            </MenuItem>

            <MenuItem value="PENDING">
              Chờ xác nhận
            </MenuItem>

            <MenuItem value="CONFIRMED">
              Đã xác nhận
            </MenuItem>

            <MenuItem value="COMPLETED">
              Đã khám
            </MenuItem>

            <MenuItem value="CANCELLED">
              Đã hủy
            </MenuItem>
          </TextField>

          <TextField
            label="Ngày khám"
            type="date"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(
                event.target.value
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <Button
            variant="outlined"
            onClick={() => {
              setStatusFilter("");
              setDateFilter("");
            }}
            sx={{
              textTransform:
                "none",
            }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      </Paper>

      <Typography
        sx={{
          color:
            "text.secondary",
          mb: 2,
        }}
      >
        Tìm thấy{" "}
        <strong>
          {
            filteredAppointments.length
          }
        </strong>{" "}
        lịch hẹn
      </Typography>

      {loading ? (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : filteredAppointments
          .length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
          }}
        >
          <Typography
            color="text.secondary"
          >
            Không tìm thấy lịch
            hẹn phù hợp.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection:
              "column",
            gap: 2,
          }}
        >
          {filteredAppointments.map(
            (appointment) => (
              <AppointmentCard
                key={
                  appointment.id
                }
                appointment={
                  appointment
                }
                processing={
                  actionId ===
                  appointment.id
                }
                onConfirm={
                  handleConfirm
                }
                onCancel={
                  handleCancel
                }
              />
            )
          )}
        </Box>
      )}
    </Box>
  );
}

interface AppointmentCardProps {
  appointment:
    AdminAppointment;

  processing: boolean;

  onConfirm: (
    id: number
  ) => void;

  onCancel: (
    id: number
  ) => void;
}

function AppointmentCard({
  appointment,
  processing,
  onConfirm,
  onCancel,
}: AppointmentCardProps) {
  const canConfirm =
    appointment.status ===
    "PENDING";

  const canCancel =
    appointment.status ===
      "PENDING" ||
    appointment.status ===
      "CONFIRMED";

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md:
              "1.2fr 1.2fr 1fr auto",
          },
          gap: 3,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              color:
                "text.secondary",
              mb: 0.5,
            }}
          >
            Bệnh nhân
          </Typography>

          <Typography
            sx={{
              fontWeight: 700,
            }}
          >
            {
              appointment.patient
                .name
            }
          </Typography>

          <Typography
            variant="body2"
          >
            {
              appointment.patient
                .phone ||
              "Chưa cập nhật SĐT"
            }
          </Typography>

          <Typography
            variant="body2"
          >
            {
              appointment.patient
                .email
            }
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              color:
                "text.secondary",
              mb: 0.5,
            }}
          >
            Bác sĩ
          </Typography>

          <Typography
            sx={{
              fontWeight: 700,
            }}
          >
            {
              appointment.doctor
                .user.name
            }
          </Typography>

          <Typography
            variant="body2"
          >
            {
              appointment.doctor
                .user.phone ||
              "Chưa cập nhật SĐT"
            }
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            {dayjs(
              appointment.startAt
            ).format(
              "DD/MM/YYYY"
            )}
          </Typography>

          <Typography
            sx={{
              mb: 1,
            }}
          >
            {dayjs(
              appointment.startAt
            ).format("HH:mm")}
            {" - "}
            {dayjs(
              appointment.endAt
            ).format("HH:mm")}
          </Typography>

          <StatusChip
            status={
              appointment.status
            }
          />

          {appointment.reason && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color:
                  "text.secondary",
              }}
            >
              Lý do:{" "}
              {appointment.reason}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection:
              "column",
            gap: 1,
            minWidth: 150,
          }}
        >
          {canConfirm && (
            <Button
              variant="contained"
              disabled={
                processing
              }
              onClick={() =>
                onConfirm(
                  appointment.id
                )
              }
              sx={{
                textTransform:
                  "none",
              }}
            >
              Xác nhận
            </Button>
          )}

          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              disabled={
                processing
              }
              onClick={() =>
                onCancel(
                  appointment.id
                )
              }
              sx={{
                textTransform:
                  "none",
              }}
            >
              Hủy lịch
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

function StatusChip({
  status,
}: {
  status: AppointmentStatus;
}) {
  switch (status) {
    case "PENDING":
      return (
        <Chip
          label="Chờ xác nhận"
          color="warning"
          size="small"
        />
      );

    case "CONFIRMED":
      return (
        <Chip
          label="Đã xác nhận"
          color="primary"
          size="small"
        />
      );

    case "COMPLETED":
      return (
        <Chip
          label="Đã khám"
          color="success"
          size="small"
        />
      );

    case "CANCELLED":
      return (
        <Chip
          label="Đã hủy"
          size="small"
        />
      );

    default:
      return null;
  }
}

export default AdminAppointmentsPage;
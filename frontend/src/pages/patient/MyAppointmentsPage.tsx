import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import dayjs from "dayjs";

import type {
  Appointment,
  AppointmentStatus,
} from "../../types/appointment";

import {
  cancelMyAppointment,
  getMyAppointments,
} from "../../services/appointmentService";

function MyAppointmentsPage() {
  const [
    appointments,
    setAppointments,
  ] = useState<Appointment[]>([]);

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
    cancellingId,
    setCancellingId,
  ] = useState<number | null>(
    null
  );

  const loadAppointments =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getMyAppointments();

        setAppointments(
          response.data
        );
      } catch (error) {
        console.error(
          "Load appointments error:",
          error
        );

        setError(
          "Không thể tải lịch hẹn"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel =
    async (
      appointmentId: number
    ) => {
      const confirmed =
        window.confirm(
          "Bạn có chắc muốn hủy lịch hẹn này không?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setCancellingId(
          appointmentId
        );

        setError("");
        setSuccess("");

        await cancelMyAppointment(
          appointmentId
        );

        setSuccess(
          "Hủy lịch hẹn thành công"
        );

        await loadAppointments();
      } catch (error: any) {
        console.error(
          "Cancel appointment error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Không thể hủy lịch hẹn"
        );
      } finally {
        setCancellingId(null);
      }
    };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          Lịch hẹn của tôi
        </Typography>

        <Typography
          color="text.secondary"
        >
          Theo dõi các lịch khám
          đã đặt tại PHÒNG KHÁM
          PANDA.
        </Typography>
      </Box>

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

      {appointments.length ===
      0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
          }}
        >
          <Typography
            color="text.secondary"
          >
            Bạn chưa có lịch hẹn
            nào.
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
          {appointments.map(
            (appointment) => (
              <AppointmentCard
                key={
                  appointment.id
                }
                appointment={
                  appointment
                }
                cancelling={
                  cancellingId ===
                  appointment.id
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
  appointment: Appointment;

  cancelling: boolean;

  onCancel: (
    appointmentId: number
  ) => void;
}

function AppointmentCard({
  appointment,
  cancelling,
  onCancel,
}: AppointmentCardProps) {
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
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent:
            "space-between",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Avatar
            src={
              appointment.doctor
                ?.user.avatar ||
              undefined
            }
            sx={{
              width: 64,
              height: 64,
            }}
          >
            {appointment.doctor
              ?.user.name
              ?.charAt(0)
              .toUpperCase() ||
              "B"}
          </Avatar>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              BS.{" "}
              {appointment.doctor
                ?.user.name ||
                `Bác sĩ #${appointment.doctorId}`}
            </Typography>

            <Typography
              sx={{
                mb: 0.5,
              }}
            >
              Ngày khám:{" "}
              <strong>
                {dayjs(
                  appointment.startAt
                ).format(
                  "DD/MM/YYYY"
                )}
              </strong>
            </Typography>

            <Typography>
              Giờ khám:{" "}
              <strong>
                {dayjs(
                  appointment.startAt
                ).format("HH:mm")}
                {" - "}
                {dayjs(
                  appointment.endAt
                ).format("HH:mm")}
              </strong>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            minWidth: 180,
            display: "flex",
            flexDirection:
              "column",
            alignItems: {
              xs: "flex-start",
              md: "flex-end",
            },
            gap: 2,
          }}
        >
          <StatusChip
            status={
              appointment.status
            }
          />

          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                onCancel(
                  appointment.id
                )
              }
              disabled={
                cancelling
              }
              sx={{
                textTransform:
                  "none",
              }}
            >
              {cancelling
                ? "Đang hủy..."
                : "Hủy lịch"}
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
        />
      );

    case "CONFIRMED":
      return (
        <Chip
          label="Đã xác nhận"
          color="primary"
        />
      );

    case "COMPLETED":
      return (
        <Chip
          label="Đã khám"
          color="success"
        />
      );

    case "CANCELLED":
      return (
        <Chip
          label="Đã hủy"
          color="default"
        />
      );

    default:
      return null;
  }
}

export default MyAppointmentsPage;
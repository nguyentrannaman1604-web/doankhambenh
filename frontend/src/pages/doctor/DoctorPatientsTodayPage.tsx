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
  TextField,
  Typography,
} from "@mui/material";

import dayjs from "dayjs";

import type {
  AppointmentStatus,
  DoctorDailyAppointment,
} from "../../types/appointment";

import {
  completeAppointment,
  getDoctorDailyAppointments,
} from "../../services/appointmentService";

function DoctorPatientsTodayPage() {
  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    dayjs().format(
      "YYYY-MM-DD"
    )
  );

  const [
    appointments,
    setAppointments,
  ] = useState<
    DoctorDailyAppointment[]
  >([]);

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
    completingId,
    setCompletingId,
  ] = useState<number | null>(
    null
  );

  const loadAppointments =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getDoctorDailyAppointments(
            selectedDate
          );

        setAppointments(
          response.data
        );
      } catch (error) {
        console.error(
          "Load doctor appointments error:",
          error
        );

        setError(
          "Không thể tải danh sách bệnh nhân"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const handleComplete =
    async (
      appointmentId: number
    ) => {
      const confirmed =
        window.confirm(
          "Xác nhận bệnh nhân đã khám xong?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setCompletingId(
          appointmentId
        );

        setError("");
        setSuccess("");

        await completeAppointment(
          appointmentId
        );

        setSuccess(
          "Đã hoàn thành lịch khám"
        );

        await loadAppointments();
      } catch (error: any) {
        console.error(
          "Complete appointment error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Không thể hoàn thành lịch khám"
        );
      } finally {
        setCompletingId(
          null
        );
      }
    };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent:
            "space-between",
          alignItems: {
            xs: "stretch",
            md: "center",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Bệnh nhân hôm nay
          </Typography>

          <Typography
            sx={{
              color:
                "text.secondary",
            }}
          >
            Danh sách bệnh nhân
            đặt lịch khám tại
            PHÒNG KHÁM PANDA.
          </Typography>
        </Box>

        <TextField
          label="Ngày khám"
          type="date"
          value={selectedDate}
          onChange={(event) =>
            setSelectedDate(
              event.target.value
            )
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          sx={{
            minWidth: 220,
          }}
        />
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
      ) : appointments.length ===
        0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 1,
            }}
          >
            Không có bệnh nhân
          </Typography>

          <Typography
            sx={{
              color:
                "text.secondary",
            }}
          >
            Không có lịch khám
            trong ngày{" "}
            {dayjs(
              selectedDate
            ).format(
              "DD/MM/YYYY"
            )}
            .
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
              <PatientAppointmentCard
                key={
                  appointment.id
                }
                appointment={
                  appointment
                }
                completing={
                  completingId ===
                  appointment.id
                }
                onComplete={
                  handleComplete
                }
              />
            )
          )}
        </Box>
      )}
    </Box>
  );
}

interface PatientAppointmentCardProps {
  appointment:
    DoctorDailyAppointment;

  completing: boolean;

  onComplete: (
    appointmentId: number
  ) => void;
}

function PatientAppointmentCard({
  appointment,
  completing,
  onComplete,
}: PatientAppointmentCardProps) {
  const patient =
    appointment.patient;

  const canComplete =
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
            sx={{
              width: 64,
              height: 64,
            }}
          >
            {patient.name
              ?.charAt(0)
              .toUpperCase()}
          </Avatar>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              {patient.name}
            </Typography>

            <Typography
              sx={{
                mb: 0.5,
              }}
            >
              Giờ khám:{" "}
              <strong>
                {dayjs(
                  appointment.startAt
                ).format(
                  "HH:mm"
                )}
                {" - "}
                {dayjs(
                  appointment.endAt
                ).format(
                  "HH:mm"
                )}
              </strong>
            </Typography>

            <Typography
              sx={{
                mb: 0.5,
              }}
            >
              Email:{" "}
              {patient.email}
            </Typography>

            <Typography
              sx={{
                mb: 0.5,
              }}
            >
              Điện thoại:{" "}
              {patient.phone ||
                "Chưa cập nhật"}
            </Typography>

            <Typography
              sx={{
                mb: 0.5,
              }}
            >
              Ngày sinh:{" "}
              {patient.dateOfBirth
                ? dayjs(
                    patient.dateOfBirth
                  ).format(
                    "DD/MM/YYYY"
                  )
                : "Chưa cập nhật"}
            </Typography>

            {appointment.reason && (
              <Typography>
                Lý do khám:{" "}
                {appointment.reason}
              </Typography>
            )}
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

          {canComplete && (
            <Button
              variant="contained"
              color="success"
              disabled={
                completing
              }
              onClick={() =>
                onComplete(
                  appointment.id
                )
              }
              sx={{
                textTransform:
                  "none",
              }}
            >
              {completing
                ? "Đang xử lý..."
                : "Hoàn thành khám"}
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
        />
      );

    default:
      return null;
  }
}

export default DoctorPatientsTodayPage;
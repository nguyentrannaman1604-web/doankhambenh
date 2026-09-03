import { useEffect, useMemo, useState } from "react";

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
import axios from "axios";

import type {
  AdminAppointment,
  AppointmentStatus,
} from "../../types/appointment";

import type { Doctor } from "../../types/doctor";

import {
  confirmAppointment,
  getAllAppointments,
  staffCancelAppointment,
} from "../../services/adminAppointmentService";

import { getDoctors } from "../../services/doctorService";

function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [doctorFilter, setDoctorFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [dateFilter, setDateFilter] = useState("");

  const [loading, setLoading] = useState(true);

  const [actionId, setActionId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      setError("");

      const [appointmentResponse, doctorResponse] = await Promise.all([
        getAllAppointments(),
        getDoctors(),
      ]);

      setAppointments(appointmentResponse.data);

      setDoctors(doctorResponse.data);
    } catch (error) {
      console.error("Load admin appointments error:", error);

      setError("Không thể tải dữ liệu lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sortedDoctors = useMemo(() => {
    return [...doctors].sort((a, b) =>
      a.user.name.localeCompare(b.user.name, "vi"),
    );
  }, [doctors]);

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        const matchDoctor =
          !doctorFilter || appointment.doctorId === Number(doctorFilter);

        const matchStatus =
          !statusFilter || appointment.status === statusFilter;

        const appointmentDate = dayjs(appointment.startAt).format("YYYY-MM-DD");

        const matchDate = !dateFilter || appointmentDate === dateFilter;

        return matchDoctor && matchStatus && matchDate;
      })
      .sort((a, b) => dayjs(b.startAt).valueOf() - dayjs(a.startAt).valueOf());
  }, [appointments, doctorFilter, statusFilter, dateFilter]);

  const handleConfirm = async (appointmentId: number) => {
    const confirmed = window.confirm("Xác nhận lịch hẹn này?");

    if (!confirmed) {
      return;
    }

    try {
      setActionId(appointmentId);

      setError("");
      setSuccess("");

      await confirmAppointment(appointmentId);

      setSuccess("Xác nhận lịch hẹn thành công");

      await loadData();
    } catch (error: unknown) {
      console.error("Confirm appointment error:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Không thể xác nhận lịch hẹn",
        );
      } else {
        setError("Không thể xác nhận lịch hẹn");
      }
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    const confirmed = window.confirm("Bạn có chắc muốn hủy lịch hẹn này?");

    if (!confirmed) {
      return;
    }

    try {
      setActionId(appointmentId);

      setError("");
      setSuccess("");

      await staffCancelAppointment(appointmentId);

      setSuccess("Hủy lịch hẹn thành công");

      await loadData();
    } catch (error: unknown) {
      console.error("Staff cancel error:", error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Không thể hủy lịch hẹn");
      } else {
        setError("Không thể hủy lịch hẹn");
      }
    } finally {
      setActionId(null);
    }
  };

  const handleClearFilters = () => {
    setDoctorFilter("");
    setStatusFilter("");
    setDateFilter("");
  };

  return (
    <Box>
      {/* TIÊU ĐỀ */}

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

            fontSize: {
              xs: "1.7rem",

              sm: "2rem",

              md: "2.125rem",
            },
          }}
        >
          Quản lý lịch hẹn
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          Theo dõi và xử lý lịch khám tại PHÒNG KHÁM PANDA.
        </Typography>
      </Box>

      {/* THÔNG BÁO */}

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

      {/* BỘ LỌC */}

      <Paper
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },

          borderRadius: 3,

          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Bộ lọc lịch hẹn
        </Typography>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",

              sm: "repeat(2, 1fr)",

              lg: "repeat(4, 1fr)",
            },

            gap: 2,

            alignItems: "center",
          }}
        >
          {/* BÁC SĨ */}

          <TextField
            select
            fullWidth
            label="Bác sĩ"
            value={doctorFilter}
            onChange={(event) => setDoctorFilter(event.target.value)}
          >
            <MenuItem value="">Tất cả bác sĩ</MenuItem>

            {sortedDoctors.map((doctor) => (
              <MenuItem key={doctor.id} value={String(doctor.id)}>
                {doctor.user.name}
              </MenuItem>
            ))}
          </TextField>

          {/* NGÀY */}

          <TextField
            fullWidth
            label="Ngày khám"
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            select
            fullWidth
            label="Trạng thái"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <MenuItem value="">Tất cả trạng thái</MenuItem>

            <MenuItem value="PENDING">Chờ xác nhận</MenuItem>

            <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>

            <MenuItem value="COMPLETED">Đã khám</MenuItem>

            <MenuItem value="CANCELLED">Đã hủy</MenuItem>
          </TextField>

          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{
              textTransform: "none",

              minHeight: 56,
            }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      </Paper>

      <Typography
        sx={{
          color: "text.secondary",

          mb: 2,
        }}
      >
        Tìm thấy <strong>{filteredAppointments.length}</strong> lịch hẹn
      </Typography>

      {loading ? (
        <Box
          sx={{
            minHeight: 300,

            display: "flex",

            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : filteredAppointments.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },

            textAlign: "center",

            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,

              mb: 1,
            }}
          >
            Không tìm thấy lịch hẹn
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
            }}
          >
            Không có lịch hẹn nào phù hợp với bộ lọc hiện tại.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",

            flexDirection: "column",

            gap: 2,
          }}
        >
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              processing={actionId === appointment.id}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

interface AppointmentCardProps {
  appointment: AdminAppointment;

  processing: boolean;

  onConfirm: (id: number) => void;

  onCancel: (id: number) => void;
}

function AppointmentCard({
  appointment,
  processing,
  onConfirm,
  onCancel,
}: AppointmentCardProps) {
  const canConfirm = appointment.status === "PENDING";

  const canCancel =
    appointment.status === "PENDING" || appointment.status === "CONFIRMED";

  return (
    <Paper
      elevation={2}
      sx={{
        p: {
          xs: 2,
          sm: 3,
        },

        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            md: "1.2fr 1.2fr 1fr auto",
          },

          gap: 3,

          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "text.secondary",

              mb: 0.5,

              fontSize: "0.875rem",
            }}
          >
            Bệnh nhân
          </Typography>

          <Typography
            sx={{
              fontWeight: 700,

              mb: 0.5,
            }}
          >
            {appointment.patient.name}
          </Typography>

          <Typography variant="body2">
            {appointment.patient.phone || "Chưa cập nhật SĐT"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",

              overflowWrap: "anywhere",
            }}
          >
            {appointment.patient.email}
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              color: "text.secondary",

              mb: 0.5,

              fontSize: "0.875rem",
            }}
          >
            Bác sĩ
          </Typography>

          <Typography
            sx={{
              fontWeight: 700,

              mb: 0.5,
            }}
          >
            {appointment.doctor.user.name}
          </Typography>

          <Typography variant="body2">
            {appointment.doctor.user.phone || "Chưa cập nhật SĐT"}
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 700,

              mb: 0.5,
            }}
          >
            {dayjs(appointment.startAt).format("DD/MM/YYYY")}
          </Typography>

          <Typography
            sx={{
              mb: 1,
            }}
          >
            {dayjs(appointment.startAt).format("HH:mm")}

            {" - "}

            {dayjs(appointment.endAt).format("HH:mm")}
          </Typography>

          <StatusChip status={appointment.status} />

          {appointment.reason && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,

                color: "text.secondary",
              }}
            >
              Lý do: {appointment.reason}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",

            flexDirection: "column",

            gap: 1,

            minWidth: {
              md: 150,
            },
          }}
        >
          {canConfirm && (
            <Button
              variant="contained"
              disabled={processing}
              onClick={() => onConfirm(appointment.id)}
              sx={{
                textTransform: "none",
              }}
            >
              {processing ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          )}

          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              disabled={processing}
              onClick={() => onCancel(appointment.id)}
              sx={{
                textTransform: "none",
              }}
            >
              {processing ? "Đang xử lý..." : "Hủy lịch"}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

function StatusChip({ status }: { status: AppointmentStatus }) {
  switch (status) {
    case "PENDING":
      return <Chip label="Chờ xác nhận" color="warning" size="small" />;

    case "CONFIRMED":
      return <Chip label="Đã xác nhận" color="primary" size="small" />;

    case "COMPLETED":
      return <Chip label="Đã khám" color="success" size="small" />;

    case "CANCELLED":
      return <Chip label="Đã hủy" size="small" />;

    default:
      return null;
  }
}

export default AdminAppointmentsPage;

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import dayjs from "dayjs";

import type { Doctor, AvailabilitySlot } from "../../types/doctor";

import {
  getDoctorById,
  getDoctorAvailability,
} from "../../services/doctorService";

import { createAppointment } from "../../services/appointmentService";

function DoctorDetailPage() {
  const { id } = useParams();

  const doctorId = Number(id);

  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const [selectedDate, setSelectedDate] = useState("");

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const [loadingSlots, setLoadingSlots] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [booking, setBooking] = useState(false);

  const [bookingSuccess, setBookingSuccess] = useState("");

  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDoctorById(doctorId);

        setDoctor(response.data);
      } catch (error) {
        console.error("Load doctor error:", error);

        setError("Không thể tải thông tin bác sĩ");
      } finally {
        setLoading(false);
      }
    };

    if (Number.isInteger(doctorId) && doctorId > 0) {
      loadDoctor();
    } else {
      setError("Mã bác sĩ không hợp lệ");

      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        setLoadingSlots(true);
        setError("");
        setSelectedSlot(null);

        const response = await getDoctorAvailability(doctorId, selectedDate);

        setSlots(response.data.slots);
      } catch (error) {
        console.error("Load availability error:", error);

        setSlots([]);

        setError("Không thể tải lịch trống của bác sĩ");
      } finally {
        setLoadingSlots(false);
      }
    };

    if (selectedDate && doctorId > 0) {
      loadAvailability();
    }
  }, [selectedDate, doctorId]);

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setBookingError("Vui lòng chọn giờ khám");

      return;
    }

    try {
      setBooking(true);
      setBookingError("");
      setBookingSuccess("");

      await createAppointment({
        doctorId,
        startAt: selectedSlot.startAt,
        endAt: selectedSlot.endAt,
      });

      setBookingSuccess("Đặt lịch khám thành công");

      setTimeout(() => {
        navigate("/patient/appointments");
      }, 1200);
    } catch (error: any) {
      console.error("Create appointment error:", error);

      setBookingError(
        error.response?.data?.message || "Không thể đặt lịch khám",
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!doctor) {
    return <Alert severity="error">{error || "Không tìm thấy bác sĩ"}</Alert>;
  }

  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          p: {
            xs: 3,
            md: 4,
          },
          borderRadius: 3,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 3,
            alignItems: {
              xs: "center",
              sm: "flex-start",
            },
          }}
        >
          <Avatar
            src={doctor.user.avatar || undefined}
            alt={doctor.user.name}
            sx={{
              width: 130,
              height: 130,
              fontSize: 40,
            }}
          >
            {doctor.user.name.charAt(0).toUpperCase()}
          </Avatar>

          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              {doctor.user.name}
            </Typography>

            <Typography
              sx={{
                color: "primary.main",
                fontWeight: 600,
                fontSize: 18,
                mb: 2,
              }}
            >
              {doctor.specialties.map((item) => item.specialty.name).join(", ")}
            </Typography>

            <Typography
              sx={{
                mb: 1,
              }}
            >
              <strong>Kinh nghiệm:</strong>{" "}
              {doctor.experience ? `${doctor.experience} năm` : "Đang cập nhật"}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
              }}
            >
              {doctor.bio || "Thông tin giới thiệu bác sĩ đang được cập nhật."}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          p: {
            xs: 3,
            md: 4,
          },
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Chọn lịch khám
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            mb: 3,
          }}
        >
          Chọn ngày để xem các khung giờ còn trống của bác sĩ.
        </Typography>

        <TextField
          label="Ngày khám"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          sx={{
            width: {
              xs: "100%",
              sm: 300,
            },
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },

            htmlInput: {
              min: dayjs().format("YYYY-MM-DD"),
            },
          }}
        />

        <Divider
          sx={{
            my: 3,
          }}
        />

        {!selectedDate && (
          <Typography color="text.secondary">
            Vui lòng chọn ngày khám.
          </Typography>
        )}

        {/* ĐANG LOAD SLOT */}

        {selectedDate && loadingSlots && (
          <Box
            sx={{
              py: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={30} />
          </Box>
        )}

        {selectedDate && !loadingSlots && slots.length > 0 && (
          <>
            <Typography
              sx={{
                fontWeight: 600,
                mb: 2,
              }}
            >
              Giờ khám còn trống
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              {slots.map((slot) => (
                <Button
                  key={slot.startAt}
                  variant={
                    selectedSlot?.startAt === slot.startAt
                      ? "contained"
                      : "outlined"
                  }
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot)}
                  sx={{
                    minWidth: 100,
                    textTransform: "none",
                  }}
                >
                  {slot.start}
                </Button>
              ))}
            </Box>
          </>
        )}

        {/* KHÔNG CÓ SLOT */}

        {selectedDate && !loadingSlots && slots.length === 0 && !error && (
          <Alert
            severity="info"
            sx={{
              mt: 2,
            }}
          >
            Bác sĩ không còn khung giờ trống trong ngày này.
          </Alert>
        )}

        {/* ERROR */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 3,
            }}
          >
            {error}
          </Alert>
        )}

        {bookingSuccess && (
          <Alert
            severity="success"
            sx={{
              mt: 3,
            }}
          >
            {bookingSuccess}
          </Alert>
        )}

        {bookingError && (
          <Alert
            severity="error"
            sx={{
              mt: 3,
            }}
          >
            {bookingError}
          </Alert>
        )}

        {selectedSlot && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              bgcolor: "#e3f2fd",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Xác nhận lịch khám
            </Typography>

            <Typography
              sx={{
                mb: 1,
              }}
            >
              Bác sĩ: <strong>BS. {doctor.user.name}</strong>
            </Typography>

            <Typography
              sx={{
                mb: 1,
              }}
            >
              Ngày khám:{" "}
              <strong>{dayjs(selectedDate).format("DD/MM/YYYY")}</strong>
            </Typography>

            <Typography
              sx={{
                mb: 3,
              }}
            >
              Giờ khám:{" "}
              <strong>
                {selectedSlot.start}
                {" - "}
                {selectedSlot.end}
              </strong>
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleBookAppointment}
              disabled={booking}
              sx={{
                textTransform: "none",
                minWidth: 180,
              }}
            >
              {booking ? "Đang đặt lịch..." : "Đặt lịch khám"}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default DoctorDetailPage;

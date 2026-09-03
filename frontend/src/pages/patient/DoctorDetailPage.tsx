import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Rating,
  Typography,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";

import dayjs, { type Dayjs } from "dayjs";

import "dayjs/locale/vi";

import type { AvailabilitySlot, Doctor } from "../../types/doctor";

import {
  getDoctorAvailability,
  getDoctorById,
} from "../../services/doctorService";

import { createAppointment } from "../../services/appointmentService";

import type { Review } from "../../types/review";

import { getDoctorReviews } from "../../services/reviewService";

dayjs.locale("vi");

const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const fixedHolidays: Record<string, string> = {
  "01-01": "Tết Dương lịch",

  "04-30": "Ngày Giải phóng miền Nam",

  "05-01": "Ngày Quốc tế Lao động",

  "09-02": "Ngày Quốc khánh",
};

const specialHolidays: Record<string, string> = {};

function getHolidayName(date: Dayjs): string | null {
  const fullDate = date.format("YYYY-MM-DD");

  if (specialHolidays[fullDate]) {
    return specialHolidays[fullDate];
  }

  const monthDay = date.format("MM-DD");

  if (fixedHolidays[monthDay]) {
    return fixedHolidays[monthDay];
  }

  return null;
}

function DoctorDetailPage() {
  const { id } = useParams();

  const doctorId = Number(id);

  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));

  const [selectedDate, setSelectedDate] = useState("");

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [loadingSlots, setLoadingSlots] = useState(false);

  const [error, setError] = useState("");

  const [booking, setBooking] = useState(false);

  const [bookingSuccess, setBookingSuccess] = useState("");

  const [bookingError, setBookingError] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);

  const [reviewLoading, setReviewLoading] = useState(false);

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

  const loadReviews = async (doctorId: number) => {
    try {
      setReviewLoading(true);

      const response = await getDoctorReviews(doctorId);

      setReviews(response.data);
    } catch (error) {
      console.error("Load reviews:", error);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    if (Number.isInteger(doctorId) && doctorId > 0) {
      loadReviews(doctorId);
    }
  }, [doctorId]);

  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");

    const endOfMonth = currentMonth.endOf("month");

    const firstDay = startOfMonth.day();

    const daysBefore = firstDay === 0 ? 6 : firstDay - 1;

    const calendarStart = startOfMonth.subtract(daysBefore, "day");

    const lastDay = endOfMonth.day();

    const daysAfter = lastDay === 0 ? 0 : 7 - lastDay;

    const calendarEnd = endOfMonth.add(daysAfter, "day");

    const days: Dayjs[] = [];

    let currentDay = calendarStart;

    while (
      currentDay.isBefore(calendarEnd, "day") ||
      currentDay.isSame(calendarEnd, "day")
    ) {
      days.push(currentDay);

      currentDay = currentDay.add(1, "day");
    }

    return days;
  }, [currentMonth]);

  const handleSelectDate = (date: Dayjs) => {
    if (date.isBefore(dayjs().startOf("day"))) {
      return;
    }

    if (getHolidayName(date)) {
      return;
    }

    setSelectedDate(date.format("YYYY-MM-DD"));

    setBookingError("");

    setBookingSuccess("");
  };

  const handlePreviousMonth = () => {
    const previousMonth = currentMonth.subtract(1, "month");

    if (previousMonth.endOf("month").isBefore(dayjs().startOf("month"))) {
      return;
    }

    setCurrentMonth(previousMonth);
  };

  const handleNextMonth = () => {
    setCurrentMonth((previous) => previous.add(1, "month"));
  };

  const handleCurrentMonth = () => {
    setCurrentMonth(dayjs().startOf("month"));
  };

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

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1,

                mb: 1,
              }}
            >
              <Rating
                value={Number(doctor.rating ?? 0)}
                precision={0.5}
                readOnly
                size="small"
              />

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                {doctor.rating
                  ? `${Number(doctor.rating).toFixed(1)}/5`
                  : "Chưa có đánh giá"}
              </Typography>
            </Box>

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
            xs: 2,
            sm: 3,
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
          Chọn ngày trực tiếp trên lịch để xem các khung giờ còn trống của bác
          sĩ.
        </Typography>

        <Box
          sx={{
            display: "flex",

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            alignItems: {
              xs: "stretch",
              sm: "center",
            },

            justifyContent: "space-between",

            gap: 2,

            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Tháng {currentMonth.format("MM/YYYY")}
          </Typography>

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1,
            }}
          >
            <IconButton
              onClick={handlePreviousMonth}
              disabled={currentMonth.isSame(dayjs(), "month")}
              aria-label="Tháng trước"
            >
              <ChevronLeftIcon />
            </IconButton>

            <Button
              variant="outlined"
              startIcon={<TodayIcon />}
              onClick={handleCurrentMonth}
              sx={{
                textTransform: "none",
              }}
            >
              Tháng hiện tại
            </Button>

            <IconButton onClick={handleNextMonth} aria-label="Tháng sau">
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            overflowX: "auto",
          }}
        >
          <Box
            sx={{
              minWidth: {
                xs: 650,
                md: 0,
              },
            }}
          >
            {/* HEADER THỨ */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: "repeat(7, 1fr)",

                gap: {
                  xs: 0.5,
                  sm: 1,
                },

                mb: 1,
              }}
            >
              {weekDays.map((day, index) => {
                const isWeekend = index === 5 || index === 6;

                return (
                  <Box
                    key={day}
                    sx={{
                      py: 1,

                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,

                        color: isWeekend ? "error.main" : "text.secondary",
                      }}
                    >
                      {day}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: "repeat(7, 1fr)",

                gap: {
                  xs: 0.5,
                  sm: 1,
                },
              }}
            >
              {calendarDays.map((date) => {
                const dateString = date.format("YYYY-MM-DD");

                const isCurrentMonth = date.month() === currentMonth.month();

                const isToday = date.isSame(dayjs(), "day");

                const isSelected = selectedDate === dateString;

                const isPast = date.isBefore(dayjs().startOf("day"));

                const isWeekend = date.day() === 6 || date.day() === 0;

                const holidayName = getHolidayName(date);

                const isHoliday = !!holidayName;

                const disabled = isPast || isHoliday;

                return (
                  <Button
                    key={dateString}
                    disabled={disabled}
                    onClick={() => handleSelectDate(date)}
                    variant={isSelected ? "contained" : "outlined"}
                    color={
                      isSelected
                        ? "primary"
                        : isHoliday || isWeekend
                          ? "error"
                          : "inherit"
                    }
                    sx={{
                      minWidth: 0,

                      minHeight: {
                        xs: 70,
                        sm: 82,
                      },

                      p: 0.8,

                      borderRadius: 2,

                      textTransform: "none",

                      display: "flex",

                      flexDirection: "column",

                      alignItems: "center",

                      justifyContent: "center",

                      opacity: !isCurrentMonth ? 0.35 : disabled ? 0.55 : 1,

                      bgcolor:
                        !isSelected && isHoliday
                          ? "#fff1f1"
                          : !isSelected && isWeekend
                            ? "#fff8f8"
                            : undefined,

                      "&:hover": {
                        bgcolor: isSelected
                          ? undefined
                          : isWeekend
                            ? "#ffeded"
                            : "action.hover",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: isToday || isSelected ? 700 : 600,

                        color: isSelected
                          ? "inherit"
                          : isHoliday || isWeekend
                            ? "error.main"
                            : "inherit",
                      }}
                    >
                      {date.format("DD")}
                    </Typography>

                    {isToday && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 10,

                          lineHeight: 1.2,

                          color: isSelected ? "inherit" : "primary.main",
                        }}
                      >
                        Hôm nay
                      </Typography>
                    )}

                    {isHoliday && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 9,

                          lineHeight: 1.1,

                          color: "error.main",

                          mt: 0.3,

                          textAlign: "center",
                        }}
                      >
                        Nghỉ lễ
                      </Typography>
                    )}
                  </Button>
                );
              })}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,

            display: "flex",

            gap: 1,

            flexWrap: "wrap",
          }}
        >
          <Chip label="Ngày đã chọn" color="primary" size="small" />

          <Chip
            label="T7 / Chủ nhật"
            color="error"
            variant="outlined"
            size="small"
          />

          <Chip label="Ngày lễ" color="error" size="small" />
        </Box>

        <Divider
          sx={{
            my: 3,
          }}
        />

        {!selectedDate && (
          <Alert severity="info">
            Vui lòng chọn một ngày trên lịch để xem giờ khám còn trống.
          </Alert>
        )}

        {selectedDate && (
          <Typography
            sx={{
              fontWeight: 700,

              mb: 2,
            }}
          >
            Ngày đã chọn:{" "}
            <Box
              component="span"
              sx={{
                color: "primary.main",
              }}
            >
              {dayjs(selectedDate).format("DD/MM/YYYY")}
            </Box>
          </Typography>
        )}

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
          Đánh giá từ bệnh nhân
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",

            mb: 3,
          }}
        >
          Nhận xét từ những bệnh nhân đã khám với bác sĩ.
        </Typography>

        {reviewLoading ? (
          <Box
            sx={{
              display: "flex",

              justifyContent: "center",

              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : reviews.length === 0 ? (
          <Alert severity="info">Bác sĩ chưa có đánh giá.</Alert>
        ) : (
          <Box
            sx={{
              display: "flex",

              flexDirection: "column",

              gap: 2,
            }}
          >
            {reviews.map((review) => (
              <Paper
                key={review.id}
                variant="outlined"
                sx={{
                  p: 3,

                  borderRadius: 3,
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

                    gap: 1,

                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {review.patient?.name || "Bệnh nhân"}
                    </Typography>

                    <Rating value={review.rating} readOnly size="small" />
                  </Box>

                  <Chip size="small" label={`${review.rating}/5`} />
                </Box>

                <Typography>
                  {review.comment || "Không có nhận xét."}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default DoctorDetailPage;

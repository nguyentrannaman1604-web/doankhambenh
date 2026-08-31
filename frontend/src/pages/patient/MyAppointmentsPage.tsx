import { useEffect, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Rating,
  TextField,
  Typography,
} from "@mui/material";

import dayjs from "dayjs";

import axios from "axios";

import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import type { Appointment, AppointmentStatus } from "../../types/appointment";

import type { Review } from "../../types/review";

import {
  cancelMyAppointment,
  getMyAppointments,
} from "../../services/appointmentService";

import {
  createReview,
  getDoctorReviews,
  updateReview,
} from "../../services/reviewService";

import { reviewSchema, type ReviewFormData } from "../../schemas/reviewSchema";

function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [reviewsByAppointment, setReviewsByAppointment] = useState<
    Record<number, Review>
  >({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const [reviewAppointment, setReviewAppointment] =
    useState<Appointment | null>(null);

  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const [reviewError, setReviewError] = useState("");

  const [reviewSuccess, setReviewSuccess] = useState("");

  const {
    control,
    register,
    handleSubmit: handleReviewSubmit,
    reset: resetReview,
    formState: { errors: reviewErrors, isSubmitting: isReviewSubmitting },
  } = useForm<ReviewFormData>({
    resolver: yupResolver(reviewSchema),

    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  /*
   * TẢI REVIEW CỦA CÁC LỊCH ĐÃ KHÁM
   */
  const loadReviewsForAppointments = async (appointmentList: Appointment[]) => {
    try {
      const completedAppointments = appointmentList.filter(
        (appointment) => appointment.status === "COMPLETED",
      );

      if (completedAppointments.length === 0) {
        setReviewsByAppointment({});
        return;
      }

      /*
       * Lấy danh sách doctorId không trùng nhau
       */
      const doctorIds = [
        ...new Set(
          completedAppointments.map((appointment) => appointment.doctorId),
        ),
      ];

      /*
       * Gọi review của từng bác sĩ
       */
      const responses = await Promise.all(
        doctorIds.map(async (doctorId) => {
          try {
            return await getDoctorReviews(doctorId);
          } catch (error) {
            console.error(`Load reviews doctor ${doctorId}:`, error);

            return null;
          }
        }),
      );

      const appointmentIds = new Set(
        completedAppointments.map((appointment) => appointment.id),
      );

      const reviewMap: Record<number, Review> = {};

      responses.forEach((response) => {
        if (!response) {
          return;
        }

        response.data.forEach((review) => {
          /*
           * Review thuộc appointment của bệnh nhân hiện tại
           */
          if (appointmentIds.has(review.appointmentId)) {
            reviewMap[review.appointmentId] = review;
          }
        });
      });

      setReviewsByAppointment(reviewMap);
    } catch (error) {
      console.error("Load appointment reviews:", error);
    }
  };

  /*
   * TẢI LỊCH HẸN
   */
  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyAppointments();

      setAppointments(response.data);

      await loadReviewsForAppointments(response.data);
    } catch (error) {
      console.error("Load appointments error:", error);

      setError("Không thể tải lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  /*
   * HỦY LỊCH
   */
  const handleCancel = async (appointmentId: number) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn hủy lịch hẹn này không?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(appointmentId);

      setError("");
      setSuccess("");
      setReviewSuccess("");

      await cancelMyAppointment(appointmentId);

      setSuccess("Hủy lịch hẹn thành công");

      await loadAppointments();
    } catch (error: unknown) {
      console.error("Cancel appointment error:", error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Không thể hủy lịch hẹn");
      } else {
        setError("Không thể hủy lịch hẹn");
      }
    } finally {
      setCancellingId(null);
    }
  };

  /*
   * MỞ FORM TẠO REVIEW
   */
  const handleOpenCreateReview = (appointment: Appointment) => {
    setReviewAppointment(appointment);

    setEditingReview(null);

    setReviewError("");
    setReviewSuccess("");

    resetReview({
      rating: 5,
      comment: "",
    });
  };

  /*
   * MỞ FORM SỬA REVIEW
   */
  const handleOpenEditReview = (appointment: Appointment, review: Review) => {
    /*
     * Backend chỉ cho sửa 1 lần
     */
    if (review.editCount >= 1) {
      return;
    }

    setReviewAppointment(appointment);

    setEditingReview(review);

    setReviewError("");
    setReviewSuccess("");

    resetReview({
      rating: review.rating,
      comment: review.comment || "",
    });
  };

  /*
   * ĐÓNG DIALOG
   */
  const handleCloseReview = () => {
    setReviewAppointment(null);

    setEditingReview(null);

    setReviewError("");

    resetReview({
      rating: 5,
      comment: "",
    });
  };

  /*
   * GỬI REVIEW
   *
   * editingReview === null
   * => tạo mới
   *
   * editingReview !== null
   * => cập nhật
   */
  const onReviewSubmit = async (data: ReviewFormData) => {
    if (!reviewAppointment) {
      return;
    }

    try {
      setReviewError("");
      setReviewSuccess("");

      setError("");
      setSuccess("");

      /*
       * SỬA REVIEW
       */
      if (editingReview) {
        await updateReview(editingReview.id, {
          rating: data.rating,

          comment: data.comment || undefined,
        });

        setReviewSuccess("Cập nhật đánh giá thành công");
      } else {

      /*
       * TẠO REVIEW MỚI
       */
        await createReview({
          appointmentId: reviewAppointment.id,

          rating: data.rating,

          comment: data.comment || undefined,
        });

        setReviewSuccess("Đánh giá bác sĩ thành công");
      }

      handleCloseReview();

      /*
       * Load lại để cập nhật trạng thái nút
       */
      await loadAppointments();
    } catch (error: unknown) {
      console.error("Submit review:", error);

      if (axios.isAxiosError(error)) {
        setReviewError(
          error.response?.data?.message || "Không thể gửi đánh giá",
        );
      } else {
        setReviewError("Không thể gửi đánh giá");
      }
    }
  };

  /*
   * LOADING
   */
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
          }}
        >
          Lịch hẹn của tôi
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          Theo dõi các lịch khám đã đặt tại PHÒNG KHÁM PANDA.
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

      {reviewSuccess && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
          }}
        >
          {reviewSuccess}
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

      {/* DANH SÁCH LỊCH HẸN */}

      {appointments.length === 0 ? (
        <Paper
          sx={{
            p: 5,

            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: "text.secondary",
            }}
          >
            Bạn chưa có lịch hẹn nào.
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
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              review={reviewsByAppointment[appointment.id]}
              cancelling={cancellingId === appointment.id}
              onCancel={handleCancel}
              onCreateReview={handleOpenCreateReview}
              onEditReview={handleOpenEditReview}
            />
          ))}
        </Box>
      )}

      {/* DIALOG REVIEW */}

      <Dialog
        open={!!reviewAppointment}
        onClose={handleCloseReview}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleReviewSubmit(onReviewSubmit)}>
          <DialogTitle>
            {editingReview ? "Sửa đánh giá" : "Đánh giá bác sĩ"}
          </DialogTitle>

          <DialogContent>
            <Box
              sx={{
                pt: 1,

                display: "flex",

                flexDirection: "column",

                gap: 3,
              }}
            >
              {/* TÊN BÁC SĨ */}

              {reviewAppointment && (
                <Alert severity="info">
                  {editingReview
                    ? "Bạn đang sửa đánh giá cho "
                    : "Bạn đang đánh giá "}

                  <strong>
                    {reviewAppointment.doctor?.user.name ||
                      `Bác sĩ #${reviewAppointment.doctorId}`}
                  </strong>
                </Alert>
              )}

              {/* THÔNG BÁO SỬA 1 LẦN */}

              {editingReview && (
                <Alert severity="warning">
                  Bạn chỉ được sửa đánh giá một lần. Sau khi lưu sẽ không thể
                  sửa lại.
                </Alert>
              )}

              {/* ERROR */}

              {reviewError && <Alert severity="error">{reviewError}</Alert>}

              {/* RATING */}

              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,

                    mb: 1,
                  }}
                >
                  Mức độ hài lòng
                </Typography>

                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <Rating
                      value={field.value || 0}
                      onChange={(_, value) => {
                        field.onChange(value || 0);
                      }}
                      size="large"
                    />
                  )}
                />

                {reviewErrors.rating && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "error.main",

                      mt: 0.5,
                    }}
                  >
                    {reviewErrors.rating.message}
                  </Typography>
                )}
              </Box>

              {/* COMMENT */}

              <TextField
                label="Nhận xét"
                multiline
                rows={4}
                placeholder="Chia sẻ trải nghiệm khám của bạn..."
                {...register("comment")}
                error={!!reviewErrors.comment}
                helperText={reviewErrors.comment?.message}
              />
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              p: 3,
            }}
          >
            <Button
              onClick={handleCloseReview}
              disabled={isReviewSubmitting}
              sx={{
                textTransform: "none",
              }}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isReviewSubmitting}
              sx={{
                textTransform: "none",
              }}
            >
              {isReviewSubmitting
                ? "Đang lưu..."
                : editingReview
                  ? "Lưu thay đổi"
                  : "Gửi đánh giá"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

/*
 * PROPS CỦA APPOINTMENT CARD
 */
interface AppointmentCardProps {
  appointment: Appointment;

  review?: Review;

  cancelling: boolean;

  onCancel: (appointmentId: number) => void;

  onCreateReview: (appointment: Appointment) => void;

  onEditReview: (appointment: Appointment, review: Review) => void;
}

/*
 * CARD LỊCH HẸN
 */
function AppointmentCard({
  appointment,

  review,

  cancelling,

  onCancel,

  onCreateReview,

  onEditReview,
}: AppointmentCardProps) {
  const canCancel =
    appointment.status === "PENDING" || appointment.status === "CONFIRMED";

  const isCompleted = appointment.status === "COMPLETED";

  /*
   * Chưa đánh giá
   */
  const canCreateReview = isCompleted && !review;

  /*
   * Đã đánh giá nhưng chưa sửa
   */
  const canEditReview = isCompleted && !!review && review.editCount === 0;

  /*
   * Đã sửa đủ 1 lần
   */
  const reviewCompleted = isCompleted && !!review && review.editCount >= 1;

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

          justifyContent: "space-between",

          gap: 3,
        }}
      >
        {/* THÔNG TIN BÁC SĨ */}

        <Box
          sx={{
            display: "flex",

            gap: 2,
          }}
        >
          <Avatar
            src={appointment.doctor?.user.avatar || undefined}
            sx={{
              width: 64,

              height: 64,
            }}
          >
            {appointment.doctor?.user.name?.charAt(0).toUpperCase() || "B"}
          </Avatar>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,

                mb: 1,
              }}
            >
              {appointment.doctor?.user.name ||
                `Bác sĩ #${appointment.doctorId}`}
            </Typography>

            <Typography
              sx={{
                mb: 0.5,
              }}
            >
              Ngày khám:{" "}
              <strong>{dayjs(appointment.startAt).format("DD/MM/YYYY")}</strong>
            </Typography>

            <Typography>
              Giờ khám:{" "}
              <strong>
                {dayjs(appointment.startAt).format("HH:mm")}

                {" - "}

                {dayjs(appointment.endAt).format("HH:mm")}
              </strong>
            </Typography>

            {/* REVIEW ĐÃ TẠO */}

            {review && (
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    gap: 1,

                    mb: 0.5,
                  }}
                >
                  <Rating value={review.rating} readOnly size="small" />

                  <Chip size="small" label={`${review.rating}/5`} />
                </Box>

                {review.comment && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {review.comment}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* TRẠNG THÁI + NÚT */}

        <Box
          sx={{
            minWidth: 180,

            display: "flex",

            flexDirection: "column",

            alignItems: {
              xs: "flex-start",

              md: "flex-end",
            },

            gap: 2,
          }}
        >
          <StatusChip status={appointment.status} />

          {/* HỦY LỊCH */}

          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => onCancel(appointment.id)}
              disabled={cancelling}
              sx={{
                textTransform: "none",
              }}
            >
              {cancelling ? "Đang hủy..." : "Hủy lịch"}
            </Button>
          )}

          {/* CHƯA ĐÁNH GIÁ */}

          {canCreateReview && (
            <Button
              variant="contained"
              onClick={() => onCreateReview(appointment)}
              sx={{
                textTransform: "none",
              }}
            >
              Đánh giá bác sĩ
            </Button>
          )}

          {/* ĐƯỢC SỬA 1 LẦN */}

          {canEditReview && review && (
            <Button
              variant="outlined"
              onClick={() => onEditReview(appointment, review)}
              sx={{
                textTransform: "none",
              }}
            >
              Sửa đánh giá
            </Button>
          )}

          {/* ĐÃ SỬA HẾT QUYỀN */}

          {reviewCompleted && (
            <Chip label="Đã đánh giá" color="success" variant="outlined" />
          )}
        </Box>
      </Box>
    </Paper>
  );
}

/*
 * CHIP TRẠNG THÁI LỊCH
 */
function StatusChip({ status }: { status: AppointmentStatus }) {
  switch (status) {
    case "PENDING":
      return <Chip label="Chờ xác nhận" color="warning" />;

    case "CONFIRMED":
      return <Chip label="Đã xác nhận" color="primary" />;

    case "COMPLETED":
      return <Chip label="Đã khám" color="success" />;

    case "CANCELLED":
      return <Chip label="Đã hủy" color="default" />;

    default:
      return null;
  }
}

export default MyAppointmentsPage;

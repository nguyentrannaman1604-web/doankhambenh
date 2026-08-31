import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import dayjs from "dayjs";

import {
  getAdminOverview,
  getAppointmentsByDate,
  getTopDoctors,
} from "../../services/adminStatisticsService";

import type {
  AdminOverviewData,
  AppointmentsByDateData,
  TopDoctor,
} from "../../types/adminStatistics";

function AdminStatisticsPage() {
  const [
    overview,
    setOverview,
  ] = useState<AdminOverviewData | null>(
    null
  );

  const [
    dateStatistics,
    setDateStatistics,
  ] =
    useState<AppointmentsByDateData | null>(
      null
    );

  const [
    topDoctors,
    setTopDoctors,
  ] = useState<TopDoctor[]>([]);

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const loadOverview = async () => {
    const response =
      await getAdminOverview();

    setOverview(response.data);
  };

  const loadTopDoctors = async () => {
    const response =
      await getTopDoctors(5);

    setTopDoctors(response.data);
  };

  const loadDateStatistics =
    async (date: string) => {
      const response =
        await getAppointmentsByDate(
          date
        );

      setDateStatistics(
        response.data
      );
    };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([
          loadOverview(),
          loadTopDoctors(),
          loadDateStatistics(
            selectedDate
          ),
        ]);
      } catch (error) {
        console.error(
          "Load admin statistics:",
          error
        );

        setError(
          "Không thể tải dữ liệu thống kê"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDateChange = async (
    date: string
  ) => {
    setSelectedDate(date);

    try {
      setError("");

      await loadDateStatistics(
        date
      );
    } catch (error) {
      console.error(
        "Load date statistics:",
        error
      );

      setError(
        "Không thể tải thống kê theo ngày"
      );
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
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1,
        }}
      >
        Thống kê
      </Typography>

      <Typography
        sx={{
          color:
            "text.secondary",
          mb: 4,
        }}
      >
        Tổng quan hoạt động
        PHÒNG KHÁM PANDA.
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {overview && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm:
                "repeat(2, 1fr)",
              lg:
                "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 5,
          }}
        >
          <StatisticCard
            title="Tổng lịch hẹn"
            value={
              overview.totalAppointments
            }
          />

          <StatisticCard
            title="Chờ xác nhận"
            value={
              overview.pendingAppointments
            }
          />

          <StatisticCard
            title="Đã xác nhận"
            value={
              overview.confirmedAppointments
            }
          />

          <StatisticCard
            title="Hoàn thành"
            value={
              overview.completedAppointments
            }
          />

          <StatisticCard
            title="Đã hủy"
            value={
              overview.cancelledAppointments
            }
          />

          <StatisticCard
            title="Bác sĩ"
            value={
              overview.totalDoctors
            }
          />

          <StatisticCard
            title="Bệnh nhân"
            value={
              overview.totalPatients
            }
          />

          <StatisticCard
            title="Chuyên khoa"
            value={
              overview.totalSpecialties
            }
          />
        </Box>
      )}

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: {
              xs: "flex-start",
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
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Lịch hẹn theo ngày
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color:
                  "text.secondary",
              }}
            >
              Chọn ngày để xem
              số lượng lịch hẹn.
            </Typography>
          </Box>

          <TextField
            type="date"
            size="small"
            value={selectedDate}
            onChange={(event) =>
              handleDateChange(
                event.target.value
              )
            }
          />
        </Box>

        {dateStatistics && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm:
                  "repeat(2, 1fr)",
                md:
                  "repeat(5, 1fr)",
              },
              gap: 2,
            }}
          >
            <StatisticCard
              title="Tổng"
              value={
                dateStatistics.total
              }
            />

            <StatisticCard
              title="Chờ xác nhận"
              value={
                dateStatistics.pending
              }
            />

            <StatisticCard
              title="Đã xác nhận"
              value={
                dateStatistics.confirmed
              }
            />

            <StatisticCard
              title="Hoàn thành"
              value={
                dateStatistics.completed
              }
            />

            <StatisticCard
              title="Đã hủy"
              value={
                dateStatistics.cancelled
              }
            />
          </Box>
        )}
      </Paper>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Bác sĩ được đặt lịch
          nhiều nhất
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color:
              "text.secondary",
            mb: 3,
          }}
        >
          Top 5 bác sĩ theo số
          lượng lịch hẹn.
        </Typography>

        {topDoctors.length === 0 ? (
          <Alert severity="info">
            Chưa có dữ liệu đặt
            lịch.
          </Alert>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection:
                "column",
              gap: 2,
            }}
          >
            {topDoctors.map(
              (
                doctor,
                index
              ) => (
                <Paper
                  key={
                    doctor.doctorId
                  }
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: {
                      xs:
                        "flex-start",
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
                    <Typography
                      sx={{
                        fontWeight:
                          700,
                      }}
                    >
                      #{index + 1}{" "}
                      {
                        doctor.doctorName
                      }
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          "text.secondary",
                        mt: 0.5,
                      }}
                    >
                      Đánh giá:{" "}
                      {
                        doctor.rating
                      }
                      /5
                    </Typography>

                    <Box
                      sx={{
                        display:
                          "flex",
                        flexWrap:
                          "wrap",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      {doctor.specialties.map(
                        (
                          specialty
                        ) => (
                          <Chip
                            key={
                              specialty
                            }
                            label={
                              specialty
                            }
                            size="small"
                          />
                        )
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      textAlign: {
                        xs: "left",
                        sm: "right",
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight:
                          700,
                      }}
                    >
                      {
                        doctor.appointmentCount
                      }
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          "text.secondary",
                      }}
                    >
                      lịch hẹn
                    </Typography>
                  </Box>
                </Paper>
              )
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

interface StatisticCardProps {
  title: string;
  value: number;
}

function StatisticCard({
  title,
  value,
}: StatisticCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color:
            "text.secondary",
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

export default AdminStatisticsPage;
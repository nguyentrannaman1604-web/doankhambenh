import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import type { DoctorSchedule } from "../../types/schedule";

import { getMyDoctorSchedules } from "../../services/doctorScheduleService";

import BlockedSlotSection from "../../components/doctor/BlockedSlotSection";

const dayNames: Record<number, string> = {
  0: "Chủ Nhật",
  1: "Thứ Hai",
  2: "Thứ Ba",
  3: "Thứ Tư",
  4: "Thứ Năm",
  5: "Thứ Sáu",
  6: "Thứ Bảy",
};

function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyDoctorSchedules();

        setSchedules(response.data);
      } catch (error) {
        console.error("Load doctor schedules error:", error);

        setError("Không thể tải lịch làm việc");
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, []);

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
          Lịch làm việc
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          Theo dõi lịch làm việc hàng tuần tại PHÒNG KHÁM PANDA.
        </Typography>
      </Box>

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

      {schedules.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
          }}
        >
          <CalendarMonthIcon
            sx={{
              fontSize: 60,
              color: "text.secondary",
              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              mb: 1,
            }}
          >
            Chưa có lịch làm việc
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
            }}
          >
            Bác sĩ chưa thiết lập lịch làm việc.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </Box>
      )}

      <Alert
        severity="info"
        sx={{
          mt: 4,
        }}
      >
        Thời gian nghỉ trưa của phòng khám từ 12:00 đến 13:00. Các khung giờ này
        không được mở để bệnh nhân đặt lịch.
      </Alert>
      <BlockedSlotSection />
    </Box>
  );
}

function ScheduleCard({ schedule }: { schedule: DoctorSchedule }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          {dayNames[schedule.dayOfWeek] || `Ngày ${schedule.dayOfWeek}`}
        </Typography>

        <Chip
          label={schedule.isActive ? "Đang hoạt động" : "Tạm nghỉ"}
          color={schedule.isActive ? "success" : "default"}
          size="small"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <AccessTimeIcon color="primary" />

        <Typography>
          <strong>{schedule.startTime}</strong>

          {" - "}

          <strong>{schedule.endTime}</strong>
        </Typography>
      </Box>

      <Typography
        sx={{
          color: "text.secondary",
        }}
      >
        Thời lượng mỗi lượt khám: <strong>{schedule.slotDuration} phút</strong>
      </Typography>
    </Paper>
  );
}

export default DoctorSchedulePage;

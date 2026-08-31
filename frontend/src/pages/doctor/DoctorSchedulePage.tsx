import {
  Alert,
  Box,
  Divider,
  Typography,
} from "@mui/material";

import BlockedSlotSection from "../../components/doctor/BlockedSlotSection";

import DoctorScheduleManagement from "../../components/doctor/DoctorScheduleManagement";

function DoctorSchedulePage() {
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
          Lịch làm việc
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          Quản lý lịch làm việc hàng tuần tại PHÒNG KHÁM PANDA.
        </Typography>
      </Box>

      {/* QUẢN LÝ LỊCH HÀNG TUẦN */}

      <DoctorScheduleManagement />

      {/* THÔNG BÁO NGHỈ TRƯA */}

      <Alert
        severity="info"
        sx={{
          mt: 4,
        }}
      >
        Thời gian nghỉ trưa của phòng khám từ 12:00 đến 13:00.
        Các khung giờ này không được mở để bệnh nhân đặt lịch.
      </Alert>

      <Divider
        sx={{
          my: 5,
        }}
      />

      {/* THỜI GIAN BẬN */}

      <BlockedSlotSection />
    </Box>
  );
}

export default DoctorSchedulePage;
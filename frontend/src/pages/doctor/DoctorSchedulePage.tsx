import { useState } from "react";
import {
  Alert,
  Box,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import BlockedSlotSection from "../../components/doctor/BlockedSlotSection";

import DoctorScheduleManagement from "../../components/doctor/DoctorScheduleManagement";

import DoctorMonthlySchedule from "../../components/doctor/DoctorMonthlySchedule";

function DoctorSchedulePage() {
  const [tabValue, setTabValue] = useState(0);

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
          Quản lý và theo dõi lịch làm việc tại PHÒNG KHÁM PANDA.
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          mb: 4,

          borderRadius: 2,

          overflow: "hidden",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <Tab
            label="Theo tuần"
            sx={{
              textTransform: "none",

              fontWeight: 600,
            }}
          />

          <Tab
            label="Theo tháng"
            sx={{
              textTransform: "none",

              fontWeight: 600,
            }}
          />
        </Tabs>
      </Paper>

      {tabValue === 0 && <DoctorScheduleManagement />}

      {tabValue === 1 && <DoctorMonthlySchedule />}

      <Alert
        severity="info"
        sx={{
          mt: 4,
        }}
      >
        Thời gian nghỉ trưa của phòng khám từ 12:00 đến 13:00. Các khung giờ này
        không được mở để bệnh nhân đặt lịch.
      </Alert>

      <Divider
        sx={{
          my: 5,
        }}
      />

      <BlockedSlotSection />
    </Box>
  );
}

export default DoctorSchedulePage;

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        width: "100%",
        bgcolor: "#0d47a1",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: 70,
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            PHÒNG KHÁM PANDA
          </Typography>

          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 1,
              whiteSpace: "nowrap",
            }}
          >
            {/* PATIENT */}
            {user?.role === "PATIENT" && (
              <>
                <Button
                  component={Link}
                  to="/patient"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Trang chủ
                </Button>

                <Button
                  component={Link}
                  to="/patient/doctors"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Tìm bác sĩ
                </Button>

                <Button
                  component={Link}
                  to="/patient/appointments"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Lịch hẹn của tôi
                </Button>
                <Button
                  component={Link}
                  to="/patient/profile"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Hồ sơ của tôi
                </Button>
              </>
            )}

            {/* DOCTOR */}
            {user?.role === "DOCTOR" && (
              <>
                <Button
                  component={Link}
                  to="/doctor"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Trang chủ
                </Button>

                <Button
                  component={Link}
                  to="/doctor/schedules"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Lịch làm việc
                </Button>

                <Button
                  component={Link}
                  to="/doctor/patients"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Bệnh nhân hôm nay
                </Button>
              </>
            )}

            {/* ADMIN / RECEPTIONIST */}
            {(user?.role === "ADMIN" || user?.role === "RECEPTIONIST") && (
              <>
                <Button
                  component={Link}
                  to="/admin"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Tổng quan
                </Button>

                <Button
                  component={Link}
                  to="/admin/doctors"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Bác sĩ
                </Button>

                <Button
                  component={Link}
                  to="/admin/specialties"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Chuyên khoa
                </Button>

                <Button
                  component={Link}
                  to="/admin/appointments"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Lịch hẹn
                </Button>

                <Button
                  component={Link}
                  to="/admin/statistics"
                  color="inherit"
                  sx={menuButtonStyle}
                >
                  Thống kê
                </Button>
              </>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              ml: "auto",
            }}
          >
            <Typography
              sx={{
                color: "white",
                whiteSpace: "nowrap",
                fontWeight: 500,
              }}
            >
              {user?.name}
            </Typography>

            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                whiteSpace: "nowrap",
                fontSize: 15,
              }}
            >
              Đăng xuất
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const menuButtonStyle = {
  textTransform: "none",
  fontSize: 16,
  px: 1.5,
};

export default Navbar;

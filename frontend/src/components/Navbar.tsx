import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface MenuItem {
  label: string;
  path: string;
}

function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const patientMenu: MenuItem[] = [
    {
      label: "Trang chủ",
      path: "/patient",
    },
    {
      label: "Tìm bác sĩ",
      path: "/patient/doctors",
    },
    {
      label: "AI gợi ý",
      path: "/patient/ai-suggestion",
    },
    {
      label: "Lịch hẹn của tôi",
      path: "/patient/appointments",
    },
    {
      label: "Hồ sơ của tôi",
      path: "/patient/profile",
    },
  ];

  const doctorMenu: MenuItem[] = [
    {
      label: "Trang chủ",
      path: "/doctor",
    },
    {
      label: "Lịch làm việc",
      path: "/doctor/schedules",
    },
    {
      label: "Bệnh nhân hôm nay",
      path: "/doctor/patients-today",
    },
    {
      label: "Hồ sơ của tôi",
      path: "/doctor/profile",
    },
  ];

  const adminMenu: MenuItem[] = [
    {
      label: "Tổng quan",
      path: "/admin",
    },
    {
      label: "Bác sĩ",
      path: "/admin/doctors",
    },
    {
      label: "Chuyên khoa",
      path: "/admin/specialties",
    },
    {
      label: "Lịch hẹn",
      path: "/admin/appointments",
    },
    {
      label: "Thống kê",
      path: "/admin/statistics",
    },
  ];

  const getMenuItems = (): MenuItem[] => {
    if (!user) {
      return [];
    }

    if (user.role === "PATIENT") {
      return patientMenu;
    }

    if (user.role === "DOCTOR") {
      return doctorMenu;
    }

    if (user.role === "ADMIN" || user.role === "RECEPTIONIST") {
      return adminMenu;
    }

    return [];
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();

    setMobileOpen(false);

    navigate("/login");
  };

  const handleMobileNavigate = (path: string) => {
    navigate(path);

    setMobileOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/patient" || path === "/doctor" || path === "/admin") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  const getHomePath = () => {
    if (user?.role === "PATIENT") {
      return "/patient";
    }

    if (user?.role === "DOCTOR") {
      return "/doctor";
    }

    if (user?.role === "ADMIN" || user?.role === "RECEPTIONIST") {
      return "/admin";
    }

    return "/";
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          width: "100%",
          bgcolor: "#0d47a1",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            px: {
              xs: 2,
              sm: 3,
              lg: 3,
            },
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              minHeight: {
                xs: 64,
                lg: 70,
              },

              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              gap: 2,
            }}
          >
            {/* LOGO */}

            <Typography
              component={Link}
              to={getHomePath()}
              variant="h6"
              sx={{
                color: "white",

                textDecoration: "none",

                fontWeight: 700,

                whiteSpace: "nowrap",

                flexShrink: 0,

                fontSize: {
                  xs: 16,
                  sm: 18,
                  lg: 20,
                },
              }}
            >
              PHÒNG KHÁM PANDA
            </Typography>

            <Box
              sx={{
                display: {
                  xs: "none",

                  lg: "flex",
                },

                alignItems: "center",

                justifyContent: "center",

                gap: 0.5,

                flex: 1,
              }}
            >
              {menuItems.map((item) => {
                const active = isActive(item.path);

                return (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{
                      ...menuButtonStyle,

                      fontWeight: active ? 700 : 500,

                      bgcolor: active
                        ? "rgba(255,255,255,0.16)"
                        : "transparent",

                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.12)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            <Box
              sx={{
                display: {
                  xs: "none",

                  lg: "flex",
                },

                alignItems: "center",

                gap: 1.5,

                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  color: "white",

                  whiteSpace: "nowrap",

                  fontWeight: 500,

                  maxWidth: 150,

                  overflow: "hidden",

                  textOverflow: "ellipsis",
                }}
              >
                {user?.name}
              </Typography>

              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  textTransform: "none",

                  whiteSpace: "nowrap",

                  fontSize: 15,
                }}
              >
                Đăng xuất
              </Button>
            </Box>

            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{
                display: {
                  xs: "flex",

                  lg: "none",
                },
              }}
              aria-label="Mở menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "85%",
                sm: 360,
              },
              maxWidth: 360,
            },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",

            display: "flex",

            flexDirection: "column",
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              bgcolor: "#0d47a1",

              color: "white",

              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                justifyContent: "space-between",

                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,

                  fontSize: 17,
                }}
              >
                PHÒNG KHÁM PANDA
              </Typography>

              <IconButton
                onClick={() => setMobileOpen(false)}
                sx={{
                  color: "white",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography
              sx={{
                fontWeight: 600,

                mb: 0.5,
              }}
            >
              {user?.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                opacity: 0.85,
              }}
            >
              {getRoleLabel(user?.role)}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,

              p: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",

                fontWeight: 600,

                mb: 1,

                px: 2,
              }}
            ></Typography>

            <List>
              {menuItems.map((item) => {
                const active = isActive(item.path);

                return (
                  <ListItemButton
                    key={item.path}
                    selected={active}
                    onClick={() => handleMobileNavigate(item.path)}
                    sx={{
                      borderRadius: 2,

                      mb: 0.5,

                      py: 1.2,

                      "&.Mui-selected": {
                        bgcolor: "rgba(13,71,161,0.10)",

                        color: "#0d47a1",
                      },

                      "&.Mui-selected:hover": {
                        bgcolor: "rgba(13,71,161,0.15)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontWeight: active ? 700 : 500,
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>

          <Box
            sx={{
              p: 2,
            }}
          >
            <Divider
              sx={{
                mb: 2,
              }}
            />

            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                textTransform: "none",

                py: 1.2,

                fontWeight: 600,
              }}
            >
              Đăng xuất
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

function getRoleLabel(
  role: "PATIENT" | "DOCTOR" | "ADMIN" | "RECEPTIONIST" | undefined,
) {
  switch (role) {
    case "PATIENT":
      return "Bệnh nhân";

    case "DOCTOR":
      return "Bác sĩ";

    case "ADMIN":
      return "Quản trị viên";

    case "RECEPTIONIST":
      return "Lễ tân";

    default:
      return "";
  }
}

const menuButtonStyle = {
  textTransform: "none",

  fontSize: 15,

  px: 1.2,

  whiteSpace: "nowrap",

  borderRadius: 2,
};

export default Navbar;

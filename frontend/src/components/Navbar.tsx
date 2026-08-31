// import {
//   AppBar,
//   Box,
//   Button,
//   Container,
//   Toolbar,
//   Typography,
// } from "@mui/material";

// import { Link, useNavigate } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// function Navbar() {
//   const { user, logout } = useAuth();

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <AppBar
//       position="static"
//       elevation={1}
//       sx={{
//         width: "100%",
//         bgcolor: "#0d47a1",
//       }}
//     >
//       <Container maxWidth="xl">
//         <Toolbar
//           disableGutters
//           sx={{
//             minHeight: 70,
//             position: "relative",
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <Typography
//             component={Link}
//             to="/"
//             variant="h6"
//             sx={{
//               color: "white",
//               textDecoration: "none",
//               fontWeight: 700,
//               whiteSpace: "nowrap",
//             }}
//           >
//             PHÒNG KHÁM PANDA
//           </Typography>

//           <Box
//             sx={{
//               position: "absolute",
//               left: "50%",
//               transform: "translateX(-50%)",
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               whiteSpace: "nowrap",
//             }}
//           >
//             {/* PATIENT */}
//             {user?.role === "PATIENT" && (
//               <>
//                 <Button
//                   component={Link}
//                   to="/patient"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Trang chủ
//                 </Button>

//                 <Button
//                   component={Link}
//                   to="/patient/doctors"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Tìm bác sĩ
//                 </Button>
//                 <Button
//                   component={Link}
//                   to="/patient/ai-suggestion"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   AI gợi ý
//                 </Button>

//                 <Button
//                   component={Link}
//                   to="/patient/appointments"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Lịch hẹn của tôi
//                 </Button>
//                 <Button
//                   component={Link}
//                   to="/patient/profile"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Hồ sơ của tôi
//                 </Button>
//               </>
//             )}

//             {/* DOCTOR */}
//             {user?.role === "DOCTOR" && (
//               <>
//                 <Button
//                   component={Link}
//                   to="/doctor"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Trang chủ
//                 </Button>

//                 <Button
//                   component={Link}
//                   to="/doctor/schedules"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Lịch làm việc
//                 </Button>

//                 <Button
//                   component={Link}
//                   to="/doctor/patients-today"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Bệnh nhân hôm nay
//                 </Button>
//               </>
//             )}

//             {/* ADMIN / RECEPTIONIST */}
//             {(user?.role === "ADMIN" || user?.role === "RECEPTIONIST") && (
//               <>
//                 <Button
//                   component={Link}
//                   to="/admin"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Tổng quan
//                 </Button>

//                 <Button
//                   component={Link}
//                   to="/admin/doctors"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Bác sĩ
//                 </Button>

//                 <Button
//                   component={Link}
//                   to="/admin/specialties"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Chuyên khoa
//                 </Button>

//                 <Button
//                   component={Link}
//                   to="/admin/appointments"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Lịch hẹn
//                 </Button>

//                 <Button
//                   component={Link}
//                   to="/admin/statistics"
//                   color="inherit"
//                   sx={menuButtonStyle}
//                 >
//                   Thống kê
//                 </Button>
//               </>
//             )}
//           </Box>

//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 2,
//               ml: "auto",
//             }}
//           >
//             <Typography
//               sx={{
//                 color: "white",
//                 whiteSpace: "nowrap",
//                 fontWeight: 500,
//               }}
//             >
//               {user?.name}
//             </Typography>

//             <Button
//               color="inherit"
//               onClick={handleLogout}
//               sx={{
//                 textTransform: "none",
//                 whiteSpace: "nowrap",
//                 fontSize: 15,
//               }}
//             >
//               Đăng xuất
//             </Button>
//           </Box>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }

// const menuButtonStyle = {
//   textTransform: "none",
//   fontSize: 16,
//   px: 1.5,
// };

// export default Navbar;

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

  /*
   * MENU PATIENT
   */
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

  /*
   * MENU DOCTOR
   */
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
  ];

  /*
   * MENU ADMIN / RECEPTIONIST
   */
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

  /*
   * CHỌN MENU THEO ROLE
   */
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

  /*
   * ĐĂNG XUẤT
   */
  const handleLogout = () => {
    logout();

    setMobileOpen(false);

    navigate("/login");
  };

  /*
   * ĐIỀU HƯỚNG TRÊN MOBILE
   */
  const handleMobileNavigate = (path: string) => {
    navigate(path);

    setMobileOpen(false);
  };

  /*
   * KIỂM TRA MENU ĐANG ACTIVE
   */
  const isActive = (path: string) => {
    /*
     * Trang chủ phải khớp chính xác.
     *
     * Nếu không:
     * /patient/doctors cũng sẽ làm
     * /patient active.
     */
    if (path === "/patient" || path === "/doctor" || path === "/admin") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  /*
   * ĐƯỜNG DẪN LOGO
   */
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

            {/* =========================
                MENU DESKTOP
               ========================= */}

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

            {/* =========================
                USER DESKTOP
               ========================= */}

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

            {/* =========================
                MOBILE / TABLET
               ========================= */}

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

      {/* =============================
          DRAWER MOBILE / TABLET
         ============================= */}

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

            {/* USER */}

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

          {/* MENU */}

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
            >
              
            </Typography>

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

          {/* LOGOUT DƯỚI CÙNG */}

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

/*
 * TÊN ROLE
 */
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

/*
 * STYLE MENU DESKTOP
 */
const menuButtonStyle = {
  textTransform: "none",

  fontSize: 15,

  px: 1.2,

  whiteSpace: "nowrap",

  borderRadius: 2,
};

export default Navbar;

import { Box, Button, Chip, Container, Paper, Typography } from "@mui/material";

import {
  CalendarMonth,
  Groups,
  LocalHospital,
  MedicalServices,
  BarChart,
  Settings,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function AdminHomePage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "#f7fbff",
      }}
    >
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #edf6ff 0%, #f9fcff 55%, #eef9f5 100%)",

          py: {
            xs: 5,
            md: 8,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                md: "1.2fr 0.8fr",
              },

              gap: {
                xs: 4,
                md: 7,
              },

              alignItems: "center",
            }}
          >
            <Box>
              <Chip
                label={isAdmin ? "KHU VỰC QUẢN TRỊ" : "KHU VỰC LỄ TÂN"}
                sx={{
                  mb: 2,

                  fontWeight: 700,

                  bgcolor: "#dff3ff",

                  color: "#0877bd",
                }}
              />

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,

                  color: "#14324a",

                  fontSize: {
                    xs: 36,
                    sm: 46,
                    md: 56,
                  },

                  lineHeight: 1.15,

                  mb: 2,
                }}
              >
                Quản lý phòng khám
                <Box
                  component="span"
                  sx={{
                    display: "block",

                    color: "#1687c9",
                  }}
                >
                  nhanh chóng và hiệu quả
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",

                  fontSize: {
                    xs: 16,
                    md: 18,
                  },

                  lineHeight: 1.8,

                  maxWidth: 680,

                  mb: 4,
                }}
              >
                Quản lý bác sĩ, chuyên khoa, lịch hẹn và theo dõi hoạt động của
                PHÒNG KHÁM PANDA trên một hệ thống tập trung.
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<CalendarMonth />}
                onClick={() => navigate("/admin/appointments")}
                sx={{
                  px: 4,
                  py: 1.5,

                  textTransform: "none",

                  fontWeight: 700,

                  borderRadius: 2,
                }}
              >
                Quản lý lịch hẹn
              </Button>
            </Box>

            {/* RIGHT */}

            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 3,
                  md: 4,
                },

                borderRadius: 5,

                bgcolor: "rgba(255,255,255,0.92)",

                border: "1px solid rgba(22,135,201,0.12)",

                boxShadow: "0 20px 60px rgba(23,92,135,0.12)",
              }}
            >
              <Box
                sx={{
                  width: 90,

                  height: 90,

                  borderRadius: "50%",

                  bgcolor: "#e8f6ff",

                  display: "flex",

                  justifyContent: "center",

                  alignItems: "center",

                  mx: "auto",

                  mb: 2,
                }}
              >
                <Settings
                  sx={{
                    fontSize: 48,

                    color: "#1687c9",
                  }}
                />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,

                  textAlign: "center",

                  color: "#14324a",

                  mb: 1,
                }}
              >
                {isAdmin ? "Quản trị hệ thống" : "Quản lý lễ tân"}
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",

                  textAlign: "center",

                  lineHeight: 1.8,
                }}
              >
                {isAdmin
                  ? "Theo dõi và quản lý các hoạt động chính của phòng khám."
                  : "Hỗ trợ bác sĩ và bệnh nhân trong quá trình đặt và quản lý lịch khám."}
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 7,
            md: 9,
          },
        }}
      >
        <Box
          sx={{
            textAlign: "center",

            mb: 5,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,

              color: "#14324a",
            }}
          >
            Quản lý phòng khám
          </Typography>

          <Typography
            sx={{
              mt: 1,

              color: "text.secondary",
            }}
          >
            Truy cập nhanh các khu vực quản lý chính.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },

            gap: 3,
          }}
        >
          <AdminCard
            icon={<Groups />}
            title="Bác sĩ"
            description="Quản lý thông tin bác sĩ đang làm việc tại phòng khám."
            button="Quản lý bác sĩ"
            onClick={() => navigate("/admin/doctors")}
          />

          <AdminCard
            icon={<MedicalServices />}
            title="Chuyên khoa"
            description="Quản lý danh sách chuyên khoa của phòng khám."
            button="Quản lý chuyên khoa"
            onClick={() => navigate("/admin/specialties")}
          />

          <AdminCard
            icon={<CalendarMonth />}
            title="Lịch hẹn"
            description="Xem, lọc, xác nhận và hủy các lịch khám."
            button="Xem lịch hẹn"
            onClick={() => navigate("/admin/appointments")}
          />

          <AdminCard
            icon={<BarChart />}
            title="Thống kê"
            description="Theo dõi số lượng lịch khám và bác sĩ được đặt nhiều."
            button="Xem thống kê"
            onClick={() => navigate("/admin/statistics")}
          />
        </Box>
      </Container>

      <Box
        sx={{
          bgcolor: "white",

          py: {
            xs: 7,
            md: 9,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",

              mb: 5,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,

                color: "#14324a",
              }}
            >
              Công việc quản lý hằng ngày
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },

              gap: 3,
            }}
          >
            <AdminStep
              number="01"
              title="Kiểm tra lịch hẹn"
              description="Xem các lịch khám mới và lọc theo bác sĩ, ngày hoặc trạng thái."
            />

            <AdminStep
              number="02"
              title="Xác nhận lịch"
              description="Hỗ trợ xác nhận hoặc hủy lịch khi cần thiết."
            />

            <AdminStep
              number="03"
              title="Theo dõi hoạt động"
              description="Xem thống kê lịch khám và bác sĩ được đặt lịch nhiều nhất."
            />
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 7,
            md: 9,
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 4,
              md: 6,
            },

            borderRadius: 4,

            background: "linear-gradient(135deg, #0c78b7 0%, #27a5c7 100%)",

            color: "white",

            display: "flex",

            flexDirection: {
              xs: "column",
              md: "row",
            },

            alignItems: {
              xs: "flex-start",
              md: "center",
            },

            justifyContent: "space-between",

            gap: 3,
          }}
        >
          <Box>
            <LocalHospital
              sx={{
                fontSize: 46,

                mb: 1,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,

                mb: 1,
              }}
            >
              PHÒNG KHÁM PANDA
            </Typography>

            <Typography
              sx={{
                opacity: 0.9,

                maxWidth: 650,
              }}
            >
              Hệ thống hỗ trợ quản lý bác sĩ, bệnh nhân và lịch khám thuận tiện
              trên một nền tảng duy nhất.
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/admin/appointments")}
            sx={{
              bgcolor: "white",

              color: "#0877bd",

              px: 4,

              py: 1.5,

              textTransform: "none",

              fontWeight: 700,

              borderRadius: 2,

              "&:hover": {
                bgcolor: "#f4f9fc",
              },
            }}
          >
            Xem lịch hẹn
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

interface AdminCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  button: string;
  onClick: () => void;
}

function AdminCard({
  icon,
  title,
  description,
  button,
  onClick,
}: AdminCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",

        p: 3,

        borderRadius: 3,

        bgcolor: "white",

        border: "1px solid #e8eef3",

        transition: "0.2s ease",

        "&:hover": {
          transform: "translateY(-5px)",

          boxShadow: "0 14px 35px rgba(25,89,130,0.10)",
        },
      }}
    >
      <Box
        sx={{
          width: 54,

          height: 54,

          borderRadius: 2,

          bgcolor: "#e8f6ff",

          color: "#1687c9",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          mb: 2,

          "& svg": {
            fontSize: 30,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,

          color: "#14324a",

          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",

          lineHeight: 1.7,

          minHeight: {
            lg: 82,
          },

          mb: 2,
        }}
      >
        {description}
      </Typography>

      <Button
        variant="outlined"
        onClick={onClick}
        sx={{
          textTransform: "none",

          fontWeight: 700,

          borderRadius: 2,
        }}
      >
        {button}
      </Button>
    </Paper>
  );
}

interface AdminStepProps {
  number: string;
  title: string;
  description: string;
}

function AdminStep({ number, title, description }: AdminStepProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,

        borderRadius: 3,

        height: "100%",
      }}
    >
      <Typography
        sx={{
          fontSize: 48,

          lineHeight: 1,

          fontWeight: 900,

          color: "rgba(22,135,201,0.15)",

          mb: 2,
        }}
      >
        {number}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,

          color: "#14324a",

          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",

          lineHeight: 1.8,
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
}

export default AdminHomePage;

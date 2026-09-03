import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import {
  CalendarMonth,
  EventAvailable,
  Groups,
  AccessTime,
  MedicalServices,
} from "@mui/icons-material";

function DoctorHomePage() {
  const navigate = useNavigate();

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
            "linear-gradient(135deg, #e7f5ff 0%, #f8fcff 55%, #e8f8f2 100%)",

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
                label="KHU VỰC BÁC SĨ"
                sx={{
                  mb: 2,

                  bgcolor: "#dff3ff",

                  color: "#0877bd",

                  fontWeight: 700,
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
                Quản lý lịch khám
                <Box
                  component="span"
                  sx={{
                    display: "block",

                    color: "#1687c9",
                  }}
                >
                  thuận tiện mỗi ngày
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

                  maxWidth: 650,

                  mb: 4,
                }}
              >
                Theo dõi lịch làm việc, quản lý thời gian nghỉ và xem danh sách
                bệnh nhân trong ngày tại PHÒNG KHÁM PANDA.
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CalendarMonth />}
                  onClick={() => navigate("/doctor/schedules")}
                  sx={{
                    px: 4,
                    py: 1.5,

                    textTransform: "none",

                    fontWeight: 700,

                    borderRadius: 2,
                  }}
                >
                  Quản lý lịch làm việc
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Groups />}
                  onClick={() => navigate("/doctor/patients-today")}
                  sx={{
                    px: 4,
                    py: 1.5,

                    textTransform: "none",

                    fontWeight: 700,

                    borderRadius: 2,

                    bgcolor: "white",
                  }}
                >
                  Bệnh nhân hôm nay
                </Button>
              </Stack>
            </Box>

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

                  alignItems: "center",

                  justifyContent: "center",

                  mx: "auto",

                  mb: 2,
                }}
              >
                <MedicalServices
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
                PHÒNG KHÁM PANDA
              </Typography>

              <Typography
                sx={{
                  textAlign: "center",

                  color: "text.secondary",

                  lineHeight: 1.8,
                }}
              >
                Hỗ trợ bác sĩ quản lý lịch khám và chăm sóc bệnh nhân hiệu quả
                hơn.
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
            Công việc của bác sĩ
          </Typography>

          <Typography
            sx={{
              mt: 1,

              color: "text.secondary",
            }}
          >
            Truy cập nhanh các chức năng thường sử dụng.
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
          <DoctorFeatureCard
            icon={
              <CalendarMonth
                sx={{
                  fontSize: 42,
                }}
              />
            }
            title="Lịch làm việc"
            description="Thiết lập lịch theo tuần, xem theo tháng, chỉnh sửa và quản lý giờ khám."
            buttonLabel="Quản lý lịch"
            onClick={() => navigate("/doctor/schedules")}
          />

          <DoctorFeatureCard
            icon={
              <Groups
                sx={{
                  fontSize: 42,
                }}
              />
            }
            title="Bệnh nhân hôm nay"
            description="Xem danh sách bệnh nhân có lịch khám trong ngày và thông tin liên hệ."
            buttonLabel="Xem bệnh nhân"
            onClick={() => navigate("/doctor/patients-today")}
          />

          <DoctorFeatureCard
            icon={
              <AccessTime
                sx={{
                  fontSize: 42,
                }}
              />
            }
            title="Nghỉ đột xuất"
            description="Chặn một khoảng thời gian khi bác sĩ có việc bận hoặc không thể tiếp nhận bệnh nhân."
            buttonLabel="Quản lý thời gian"
            onClick={() => navigate("/doctor/schedules")}
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
              Quy trình làm việc
            </Typography>

            <Typography
              sx={{
                mt: 1,

                color: "text.secondary",
              }}
            >
              Một quy trình đơn giản giúp bác sĩ quản lý lịch khám hiệu quả.
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
            <DoctorStep
              number="01"
              title="Thiết lập lịch"
              description="Tạo các ngày và khung giờ làm việc theo tuần."
            />

            <DoctorStep
              number="02"
              title="Tiếp nhận bệnh nhân"
              description="Xem lịch hẹn và danh sách bệnh nhân cần khám trong ngày."
            />

            <DoctorStep
              number="03"
              title="Hoàn thành khám"
              description="Sau khi khám xong, cập nhật trạng thái lịch hẹn thành hoàn thành."
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

            color: "white",

            background: "linear-gradient(135deg, #0c78b7 0%, #27a5c7 100%)",

            display: "flex",

            flexDirection: {
              xs: "column",
              md: "row",
            },

            justifyContent: "space-between",

            alignItems: {
              xs: "flex-start",
              md: "center",
            },

            gap: 3,
          }}
        >
          <Box>
            <EventAvailable
              sx={{
                fontSize: 44,

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
              Bắt đầu ngày làm việc
            </Typography>

            <Typography
              sx={{
                opacity: 0.9,
              }}
            >
              Kiểm tra ngay danh sách bệnh nhân có lịch khám hôm nay.
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/doctor/patients-today")}
            sx={{
              bgcolor: "white",

              color: "#0877bd",

              px: 4,
              py: 1.5,

              fontWeight: 700,

              textTransform: "none",

              borderRadius: 2,

              "&:hover": {
                bgcolor: "#f5f9fc",
              },
            }}
          >
            Xem bệnh nhân hôm nay
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

interface DoctorFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}

function DoctorFeatureCard({
  icon,
  title,
  description,
  buttonLabel,
  onClick,
}: DoctorFeatureCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",

        p: 4,

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
          color: "#1687c9",

          mb: 2,
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

          lineHeight: 1.8,

          mb: 3,
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
        {buttonLabel}
      </Button>
    </Paper>
  );
}

interface DoctorStepProps {
  number: string;
  title: string;
  description: string;
}

function DoctorStep({ number, title, description }: DoctorStepProps) {
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

          fontWeight: 900,

          color: "rgba(22,135,201,0.15)",

          lineHeight: 1,

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

export default DoctorHomePage;

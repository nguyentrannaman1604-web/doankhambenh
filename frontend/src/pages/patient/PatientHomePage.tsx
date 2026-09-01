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

function PatientHomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "#f7fbff",
        minHeight: "100vh",
      }}
    >
      {/* =========================
          HERO
      ========================== */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #eaf6ff 0%, #f8fcff 50%, #e8f7f4 100%)",
          py: {
            xs: 6,
            md: 10,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                md: "1.15fr 0.85fr",
              },

              alignItems: "center",

              gap: {
                xs: 5,
                md: 8,
              },
            }}
          >
            {/* LEFT */}
            <Box>
              <Chip
                label="PHÒNG KHÁM PANDA"
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

                  fontSize: {
                    xs: 38,
                    sm: 48,
                    md: 58,
                  },

                  lineHeight: 1.15,

                  color: "#14324a",

                  mb: 2,
                }}
              >
                Chăm sóc sức khỏe
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    color: "#1687c9",
                  }}
                >
                  dễ dàng hơn mỗi ngày
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
                Tìm bác sĩ phù hợp, xem lịch khám
                còn trống và đặt lịch trực tuyến
                nhanh chóng tại PHÒNG KHÁM PANDA.
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
                  onClick={() =>
                    navigate(
                      "/patient/doctors"
                    )
                  }
                  sx={{
                    px: 4,
                    py: 1.5,

                    textTransform: "none",

                    fontWeight: 700,

                    borderRadius: 2,

                    fontSize: 16,
                  }}
                >
                  Tìm bác sĩ
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() =>
                    navigate(
                      "/patient/ai-suggestion"
                    )
                  }
                  sx={{
                    px: 4,
                    py: 1.5,

                    textTransform: "none",

                    fontWeight: 700,

                    borderRadius: 2,

                    fontSize: 16,

                    bgcolor: "white",
                  }}
                >
                  AI gợi ý chuyên khoa
                </Button>
              </Stack>
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

                bgcolor:
                  "rgba(255,255,255,0.9)",

                border:
                  "1px solid rgba(22,135,201,0.12)",

                boxShadow:
                  "0 20px 60px rgba(23, 92, 135, 0.12)",
              }}
            >
              <Box
                sx={{
                  textAlign: "center",

                  fontSize: {
                    xs: 90,
                    md: 130,
                  },

                  lineHeight: 1,

                  mb: 2,
                }}
              >
                🐼
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
                Sức khỏe của bạn
                <br />
                là ưu tiên của Panda
              </Typography>

              <Typography
                sx={{
                  textAlign: "center",

                  color:
                    "text.secondary",

                  lineHeight: 1.7,
                }}
              >
                Đặt lịch đơn giản,
                theo dõi thuận tiện và
                kết nối với bác sĩ nhanh
                chóng.
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* =========================
          WHY PANDA
      ========================== */}
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
            Tại sao chọn PANDA?
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            Trải nghiệm đặt lịch khám
            đơn giản, nhanh chóng và
            thuận tiện.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },

            gap: 3,
          }}
        >
          <FeatureCard
            icon="👨‍⚕️"
            title="Bác sĩ chuyên môn"
            description="Dễ dàng xem thông tin, kinh nghiệm và chuyên khoa của từng bác sĩ."
          />

          <FeatureCard
            icon="📅"
            title="Đặt lịch trực tuyến"
            description="Xem lịch còn trống và lựa chọn khung giờ khám phù hợp với bạn."
          />

          <FeatureCard
            icon="🤖"
            title="AI hỗ trợ"
            description="Nhập triệu chứng để nhận gợi ý chuyên khoa phù hợp trước khi đặt lịch."
          />
        </Box>
      </Container>

      {/* =========================
          3 STEPS
      ========================== */}
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
            <Chip
              label="ĐẶT LỊCH NHANH CHÓNG"
              sx={{
                mb: 2,

                fontWeight: 700,

                bgcolor: "#e8f6ff",

                color: "#0877bd",
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#14324a",
              }}
            >
              Đặt lịch chỉ với 3 bước
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
            <StepCard
              number="01"
              title="Tìm bác sĩ"
              description="Chọn chuyên khoa và bác sĩ phù hợp với nhu cầu khám."
            />

            <StepCard
              number="02"
              title="Chọn lịch khám"
              description="Xem ngày và các khung giờ còn trống của bác sĩ."
            />

            <StepCard
              number="03"
              title="Xác nhận đặt lịch"
              description="Chọn giờ khám và xác nhận để hoàn tất lịch hẹn."
            />
          </Box>

          <Box
            sx={{
              textAlign: "center",
              mt: 5,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() =>
                navigate(
                  "/patient/doctors"
                )
              }
              sx={{
                px: 5,
                py: 1.5,

                textTransform: "none",

                fontWeight: 700,

                borderRadius: 2,
              }}
            >
              Đặt lịch ngay
            </Button>
          </Box>
        </Container>
      </Box>

      {/* =========================
          AI SECTION
      ========================== */}
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
              xs: 3,
              sm: 5,
              md: 6,
            },

            borderRadius: 4,

            background:
              "linear-gradient(135deg, #0c78b7 0%, #27a5c7 100%)",

            color: "white",

            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr auto",
              },

              alignItems: "center",

              gap: 4,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 44,
                  mb: 1,
                }}
              >
                🤖
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,

                  mb: 1.5,
                }}
              >
                Không biết nên khám
                chuyên khoa nào?
              </Typography>

              <Typography
                sx={{
                  opacity: 0.9,

                  lineHeight: 1.8,

                  maxWidth: 700,
                }}
              >
                Hãy mô tả triệu chứng
                của bạn. AI của PANDA
                sẽ hỗ trợ gợi ý chuyên
                khoa phù hợp để bạn tham
                khảo trước khi đặt lịch.
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  opacity: 0.75,

                  mt: 2,
                }}
              >
                AI chỉ hỗ trợ tham khảo
                và không thay thế chẩn
                đoán của bác sĩ.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={() =>
                navigate(
                  "/patient/ai-suggestion"
                )
              }
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
              Thử AI ngay
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* =========================
          APPOINTMENTS CTA
      ========================== */}
      <Container
        maxWidth="lg"
        sx={{
          pb: {
            xs: 8,
            md: 10,
          },
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            p: {
              xs: 3,
              md: 5,
            },

            borderRadius: 4,

            textAlign: "center",

            bgcolor: "white",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,

              color: "#14324a",

              mb: 1,
            }}
          >
            Bạn đã có lịch hẹn?
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",

              mb: 3,
            }}
          >
            Theo dõi lịch sắp tới, lịch
            đã hoàn thành hoặc hủy lịch
            khi cần.
          </Typography>

          <Button
            variant="outlined"
            onClick={() =>
              navigate(
                "/patient/appointments"
              )
            }
            sx={{
              textTransform: "none",

              fontWeight: 700,

              borderRadius: 2,

              px: 4,
            }}
          >
            Xem lịch hẹn của tôi
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

/*
 * ==========================
 * FEATURE CARD
 * ==========================
 */

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",

        p: 4,

        borderRadius: 3,

        bgcolor: "white",

        border:
          "1px solid #e8eef3",

        transition:
          "transform 0.2s ease, box-shadow 0.2s ease",

        "&:hover": {
          transform:
            "translateY(-5px)",

          boxShadow:
            "0 14px 35px rgba(25, 89, 130, 0.10)",
        },
      }}
    >
      <Box
        sx={{
          fontSize: 46,
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
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
}

/*
 * ==========================
 * STEP CARD
 * ==========================
 */

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

function StepCard({
  number,
  title,
  description,
}: StepCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,

        borderRadius: 3,

        height: "100%",

        position: "relative",
      }}
    >
      <Typography
        sx={{
          fontSize: 48,

          fontWeight: 900,

          color:
            "rgba(22,135,201,0.15)",

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

export default PatientHomePage;
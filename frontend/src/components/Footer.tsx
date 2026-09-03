import {
  Box,
  Container,
  Divider,
  Typography,
} from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "#063b83",
        color: "white",
        mt: "auto",
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "2fr 1fr 1fr 1fr",
            },
            gap: 5,
          }}
        >
         
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              PHÒNG KHÁM PANDA
            </Typography>

            <Typography
              sx={{
                lineHeight: 1.9,
                color: "rgba(255,255,255,0.85)",
                maxWidth: 420,
              }}
            >
              PHÒNG KHÁM PANDA cung cấp dịch vụ
              chăm sóc sức khỏe và hỗ trợ đặt lịch
              khám trực tuyến, giúp bệnh nhân dễ
              dàng tìm kiếm bác sĩ và lựa chọn thời
              gian khám phù hợp.
            </Typography>

            <Typography
              sx={{
                mt: 3,
                fontWeight: 600,
              }}
            >
              Chăm sóc sức khỏe – Nâng tầm cuộc sống
            </Typography>
          </Box>

      
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Dịch vụ
            </Typography>

            <Typography sx={itemStyle}>
              Tìm bác sĩ
            </Typography>

            <Typography sx={itemStyle}>
              Đặt lịch khám
            </Typography>

            <Typography sx={itemStyle}>
              Tra cứu lịch hẹn
            </Typography>

            <Typography sx={itemStyle}>
              Chuyên khoa
            </Typography>

            <Typography sx={itemStyle}>
              Tư vấn sức khỏe
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Thông tin
            </Typography>

            <Typography sx={itemStyle}>
              Giới thiệu phòng khám
            </Typography>

            <Typography sx={itemStyle}>
              Đội ngũ bác sĩ
            </Typography>

            <Typography sx={itemStyle}>
              Hướng dẫn đặt lịch
            </Typography>

            <Typography sx={itemStyle}>
              Chính sách bảo mật
            </Typography>

            <Typography sx={itemStyle}>
              Câu hỏi thường gặp
            </Typography>
          </Box>

          {/* CỘT 4 */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Liên hệ
            </Typography>

            <Typography sx={itemStyle}>
              PHÒNG KHÁM PANDA
            </Typography>

            <Typography sx={itemStyle}>
              Hotline: 1900 1234
            </Typography>

            <Typography sx={itemStyle}>
              Email: contact@panda.vn
            </Typography>

            <Typography sx={itemStyle}>
              Thứ 2 - Thứ sáu
            </Typography>

            <Typography sx={itemStyle}>
              08:00 - 16:00
            </Typography>
          </Box>
        </Box>

        <Divider
          sx={{
            my: 4,
            borderColor:
              "rgba(255,255,255,0.25)",
          }}
        />

        <Typography
          sx={{
            textAlign: "center",
            color: "rgba(255,255,255,0.75)",
            fontSize: 14,
          }}
        >
          © 2026 PHÒNG KHÁM PANDA. Tất cả
          quyền được bảo lưu.
        </Typography>
      </Container>
    </Box>
  );
}

const itemStyle = {
  mb: 1.5,
  color: "rgba(255,255,255,0.82)",
};

export default Footer;
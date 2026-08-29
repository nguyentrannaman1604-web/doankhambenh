import {
  Box,
  Typography,
} from "@mui/material";

function DoctorHomePage() {
  return (
    <Box sx={{ p: 5 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
        }}
      >
        Trang bác sĩ
      </Typography>
    </Box>
  );
}

export default DoctorHomePage;
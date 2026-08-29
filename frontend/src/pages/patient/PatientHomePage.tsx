import {
  Box,
  Typography,
} from "@mui/material";

function PatientHomePage() {
  return (
    <Box sx={{ p: 5 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textAlign:"center",
          
        }}
      >
        Trang bệnh nhân
      </Typography>
    </Box>
  );
}

export default PatientHomePage;
import {
  Box,
  Typography,
} from "@mui/material";

function AdminHomePage() {
  return (
    <Box sx={{ p: 5 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
        }}
      >
        Trang quản trị
      </Typography>
    </Box>
  );
}

export default AdminHomePage;
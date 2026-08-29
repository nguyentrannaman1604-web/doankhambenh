import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import api from "../../api/axiosClient";

import {
  registerSchema,
  type RegisterFormData,
} from "../../schemas/authSchema";

import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setMessage("");

      const response = await api.post("/auth/register", data);

      console.log("Register response:", response.data);

      setSuccess(true);
      setMessage("Đăng ký tài khoản thành công");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error: any) {
      console.error("Register error:", error);

      setSuccess(false);

      setMessage(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          PHÒNG KHÁM PANDA
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            color: "text.secondary",
            mb: 3,
          }}
        >
          Đăng ký tài khoản 
        </Typography>

        {message && (
          <Alert severity={success ? "success" : "error"} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Họ và tên"
            required
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          />

          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          />

          <TextField
            label="Mật khẩu"
            type="password"
            required
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          />

          <TextField
            label="Số điện thoại"
            fullWidth
            margin="normal"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          <TextField
            label="Ngày sinh"
            type="date"
            fullWidth
            margin="normal"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                max: new Date().toISOString().split("T")[0],
              },
            }}
            {...register("dateOfBirth")}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth?.message}
          />

          <TextField
            select
            label="Giới tính"
            fullWidth
            margin="normal"
            defaultValue=""
            {...register("gender")}
            error={!!errors.gender}
            helperText={errors.gender?.message}
          >
            <MenuItem value="">Không chọn</MenuItem>

            <MenuItem value="MALE">Nam</MenuItem>

            <MenuItem value="FEMALE">Nữ</MenuItem>

            <MenuItem value="OTHER">Khác</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{
              mt: 3,
            }}
          >
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
          <Typography
            sx={{
              textAlign: "center",
              mt: 2,
            }}
          >
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default RegisterPage;

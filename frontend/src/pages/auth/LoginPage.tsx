import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

import api from "../../api/axiosClient";
import type { LoginResponse } from "../../types/auth";
import { useAuth } from "../../context/AuthContext";

import { yupResolver } from "@hookform/resolvers/yup";

import { loginSchema, type LoginFormData } from "../../schemas/authSchema";

import { Link } from "react-router-dom";

function LoginPage() {
  const { login } = useAuth();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setMessage("");

      const response = await api.post<LoginResponse>("/auth/login", data);

      const { user, accessToken, refreshToken } = response.data.data;

      login(user, accessToken, refreshToken);

      console.log("User:", user);

      setSuccess(true);
      setMessage("Đăng nhập thành công");
    } catch (error: any) {
      console.error("Login error:", error);

      setSuccess(false);

      setMessage(error.response?.data?.message || "Đăng nhập thất bại");
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
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 420,
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
          Đăng nhập hệ thống
        </Typography>

        {message && (
          <Alert severity={success ? "success" : "error"} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register("email", {
              required: "Email là bắt buộc",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email không hợp lệ",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", {
              required: "Mật khẩu là bắt buộc",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 3 }}
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
          <Typography
            sx={{
              textAlign: "center",
              mt: 2,
            }}
          >
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;

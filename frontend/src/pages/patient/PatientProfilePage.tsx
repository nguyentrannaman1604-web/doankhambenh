import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import {
  patientProfileSchema,
  type PatientProfileFormData,
} from "../../schemas/patientSchema";
import {
  getPatientProfile,
  updatePatientProfile,
} from "../../services/patientService";

import { useAuth } from "../../context/AuthContext";
function PatientProfilePage() {
  const { updateUser } = useAuth();

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientProfileFormData>({
    resolver: yupResolver(patientProfileSchema),
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        setMessage("");

        const response = await getPatientProfile();

        const profile = response.data;

        setEmail(profile.email || "");

        reset({
          name: profile.name || "",

          phone: profile.phone || "",

          dateOfBirth: profile.dateOfBirth
            ? dayjs(profile.dateOfBirth).format("YYYY-MM-DD")
            : "",

          gender: profile.gender || undefined,
        });
      } catch (error) {
        console.error("Load profile error:", error);

        setSuccess(false);

        setMessage("Không thể tải thông tin hồ sơ");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  const onSubmit = async (data: PatientProfileFormData) => {
    try {
      setMessage("");
      const response = await updatePatientProfile(data);
      const updatedProfile = response.data;

      updateUser({
        name: updatedProfile.name,

        phone: updatedProfile.phone,
      });

      reset({
        name: updatedProfile.name || "",

        phone: updatedProfile.phone || "",

        dateOfBirth: updatedProfile.dateOfBirth
          ? dayjs(updatedProfile.dateOfBirth).format("YYYY-MM-DD")
          : "",

        gender: updatedProfile.gender || undefined,
      });

      setSuccess(true);

      setMessage("Cập nhật hồ sơ thành công");
    } catch (error: unknown) {
      console.error("Update profile error:", error);

      setSuccess(false);

      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Cập nhật hồ sơ thất bại");
      } else {
        setMessage("Cập nhật hồ sơ thất bại");
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,

          display: "flex",

          justifyContent: "center",

          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",

        justifyContent: "center",

        px: {
          xs: 0,
          sm: 1,
        },
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",

          maxWidth: 700,

          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          borderRadius: 2,
        }}
      >
        {/* TIÊU ĐỀ */}

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,

            mb: 1,

            fontSize: {
              xs: "1.7rem",
              sm: "2rem",
              md: "2.125rem",
            },
          }}
        >
          Hồ sơ bệnh nhân
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",

            mb: 3,
          }}
        >
          Cập nhật thông tin cá nhân của bạn
        </Typography>

        {message && (
          <Alert
            severity={success ? "success" : "error"}
            sx={{
              mb: 2,
            }}
          >
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* HỌ TÊN */}

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
            value={email}
            fullWidth
            margin="normal"
            disabled
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
                max: dayjs().format("YYYY-MM-DD"),
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
            size="large"
            fullWidth
            disabled={isSubmitting}
            sx={{
              mt: 3,

              py: 1.3,

              textTransform: "none",

              fontWeight: 600,
            }}
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default PatientProfilePage;

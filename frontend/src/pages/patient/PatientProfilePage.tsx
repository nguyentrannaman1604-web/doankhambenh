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

import {
  patientProfileSchema,
  type PatientProfileFormData,
} from "../../schemas/patientSchema";

import {
  getPatientProfile,
  updatePatientProfile,
} from "../../services/patientService";

function PatientProfilePage() {
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientProfileFormData>({
    resolver: yupResolver(patientProfileSchema),
  });

  const [email, setEmail] = useState("");

  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

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

      await updatePatientProfile(data);

      setSuccess(true);

      setMessage("Cập nhật hồ sơ thành công");
    } catch (error: any) {
      console.error("Update profile error:", error);

      setSuccess(false);

      setMessage(error.response?.data?.message || "Cập nhật hồ sơ thất bại");
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
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 700,
          p: {
            xs: 3,
            md: 4,
          },
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
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

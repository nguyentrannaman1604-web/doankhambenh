import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import axios from "axios";

import type { Doctor, Specialty } from "../../types/doctor";

import {
  createDoctorSchema,
  updateDoctorSchema,
  type CreateDoctorFormData,
  type UpdateDoctorFormData,
} from "../../schemas/adminDoctorSchema";

import {
  createDoctor,
  deleteDoctor,
  getAdminDoctors,
  updateDoctor,
} from "../../services/adminDoctorService";

import { getSpecialties } from "../../services/specialtyService";

import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";

function AdminDoctorsPage() {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateDoctorFormData>({
    resolver: yupResolver(createDoctorSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      dateOfBirth: "",
      gender: undefined,
      avatar: "",
      experience: 0,
      bio: "",
      specialtyIds: [],
    },
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [doctorResponse, specialtyResponse] = await Promise.all([
        getAdminDoctors(),
        getSpecialties(),
      ]);

      setDoctors(doctorResponse.data);

      setSpecialties(specialtyResponse.data);
    } catch (error) {
      console.error("Load admin doctors:", error);

      setError("Không thể tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClose = () => {
    setOpen(false);

    reset();
  };

  const onSubmit = async (data: CreateDoctorFormData) => {
    try {
      setError("");
      setSuccess("");

      await createDoctor({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        gender: data.gender,
        avatar: data.avatar || undefined,
        experience: data.experience,
        bio: data.bio || undefined,
        specialtyIds: data.specialtyIds,
      });

      setSuccess("Thêm bác sĩ thành công");

      handleClose();

      await loadData();
    } catch (error: unknown) {
      console.error("Create doctor:", error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Không thể thêm bác sĩ");
      } else {
        setError("Không thể thêm bác sĩ");
      }
    }
  };

  const handleDelete = async (doctorId: number) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa bác sĩ này?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteDoctor(doctorId);

      setSuccess("Xóa bác sĩ thành công");

      await loadData();
    } catch (error: unknown) {
      console.error("Delete doctor:", error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Không thể xóa bác sĩ");
      } else {
        setError("Không thể xóa bác sĩ");
      }
    }
  };

  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const {
    register: registerEdit,
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors, isSubmitting: isEditingSubmitting },
  } = useForm<UpdateDoctorFormData>({
    resolver: yupResolver(updateDoctorSchema),

    defaultValues: {
      name: "",
      phone: "",
      dateOfBirth: "",
      gender: undefined,
      avatar: "",
      experience: 0,
      bio: "",
      specialtyIds: [],
    },
  });

  const handleOpenEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);

    resetEdit({
      name: doctor.user.name,

      phone: doctor.user.phone || "",

      dateOfBirth: doctor.user.dateOfBirth
        ? dayjs(doctor.user.dateOfBirth).format("YYYY-MM-DD")
        : "",

      gender: doctor.user.gender || undefined,

      avatar: doctor.user.avatar || "",

      experience: doctor.experience || 0,

      bio: doctor.bio || "",

      specialtyIds: doctor.specialties.map((item) => item.specialty.id),
    });
  };

  const handleCloseEdit = () => {
    setEditingDoctor(null);

    resetEdit();
  };

  const onEditSubmit = async (data: UpdateDoctorFormData) => {
    if (!editingDoctor) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await updateDoctor(editingDoctor.id, {
        name: data.name,

        phone: data.phone || undefined,

        dateOfBirth: data.dateOfBirth || undefined,

        gender: data.gender,

        avatar: data.avatar || undefined,

        experience: data.experience,

        bio: data.bio || undefined,

        specialtyIds: data.specialtyIds,
      });

      setSuccess("Cập nhật bác sĩ thành công");

      handleCloseEdit();

      await loadData();
    } catch (error: unknown) {
      console.error("Update doctor:", error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Không thể cập nhật bác sĩ");
      } else {
        setError("Không thể cập nhật bác sĩ");
      }
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Quản lý bác sĩ
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
            }}
          >
            Quản lý đội ngũ bác sĩ tại PHÒNG KHÁM PANDA.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            textTransform: "none",
          }}
        >
          Thêm bác sĩ
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {doctors.map((doctor) => (
            <Paper
              key={doctor.id}
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Avatar
                  src={doctor.user.avatar || undefined}
                  sx={{
                    width: 64,
                    height: 64,
                  }}
                >
                  {doctor.user.name.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Mã bác sĩ: #{doctor.id}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {doctor.user.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {doctor.user.email}
                  </Typography>

                  <Typography variant="body2">
                    {doctor.user.phone || "Chưa cập nhật SĐT"}
                  </Typography>

                  <Typography variant="body2">
                    Ngày sinh:{" "}
                    {doctor.user.dateOfBirth
                      ? dayjs(doctor.user.dateOfBirth).format("DD/MM/YYYY")
                      : "Chưa cập nhật"}
                  </Typography>

                  <Typography variant="body2">
                    Giới tính:{" "}
                    {doctor.user.gender === "MALE"
                      ? "Nam"
                      : doctor.user.gender === "FEMALE"
                        ? "Nữ"
                        : doctor.user.gender === "OTHER"
                          ? "Khác"
                          : "Chưa cập nhật"}
                  </Typography>
                </Box>
              </Box>

              <Typography
                sx={{
                  mb: 1,
                }}
              >
                <strong>Kinh nghiệm:</strong> {doctor.experience ?? 0} năm
              </Typography>

              <Typography
                sx={{
                  mb: 2,
                }}
              >
                <strong>Đánh giá:</strong> {doctor.rating ?? "0"}
                /5
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 2,
                }}
              >
                {doctor.specialties.map((item) => (
                  <Chip
                    key={item.specialty.id}
                    label={item.specialty.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  minHeight: 60,
                  mb: 2,
                }}
              >
                {doctor.bio || "Chưa có giới thiệu."}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => handleOpenEdit(doctor)}
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Chỉnh sửa
                </Button>
                {user?.role === "ADMIN" && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(doctor.id)}
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    Xóa
                  </Button>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Thêm bác sĩ</DialogTitle>

          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: 1,
              }}
            >
              <TextField
                label="Họ tên"
                required
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
                required
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
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />

              <TextField
                label="Ngày sinh"
                type="date"
                {...register("dateOfBirth")}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Giới tính"
                    {...field}
                    value={field.value ?? ""}
                  >
                    <MenuItem value="">Không chọn</MenuItem>

                    <MenuItem value="MALE">Nam</MenuItem>

                    <MenuItem value="FEMALE">Nữ</MenuItem>

                    <MenuItem value="OTHER">Khác</MenuItem>
                  </TextField>
                )}
              />

              <TextField
                label="Avatar URL"
                {...register("avatar")}
                error={!!errors.avatar}
                helperText={errors.avatar?.message}
              />

              <TextField
                label="Số năm kinh nghiệm"
                type="number"
                required
                {...register("experience", {
                  valueAsNumber: true,
                })}
                error={!!errors.experience}
                helperText={errors.experience?.message}
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              />

              <TextField
                label="Giới thiệu"
                multiline
                rows={3}
                {...register("bio")}
              />

              <Controller
                name="specialtyIds"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.specialtyIds}>
                    <InputLabel>Chuyên khoa</InputLabel>

                    <Select
                      multiple
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
                      input={<OutlinedInput label="Chuyên khoa" />}
                      renderValue={(selected) =>
                        specialties
                          .filter((specialty) =>
                            selected.includes(specialty.id),
                          )
                          .map((specialty) => specialty.name)
                          .join(", ")
                      }
                    >
                      {specialties.map((specialty) => (
                        <MenuItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </MenuItem>
                      ))}
                    </Select>

                    {errors.specialtyIds && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "error.main",
                          mt: 0.5,
                          ml: 1.5,
                        }}
                      >
                        {errors.specialtyIds.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              p: 3,
            }}
          >
            <Button
              onClick={handleClose}
              sx={{
                textTransform: "none",
              }}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                textTransform: "none",
              }}
            >
              {isSubmitting ? "Đang thêm..." : "Thêm bác sĩ"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={!!editingDoctor}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleSubmitEdit(onEditSubmit)}>
          <DialogTitle>Chỉnh sửa bác sĩ</DialogTitle>

          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: 1,
              }}
            >
              <TextField
                label="Họ tên"
                required
                {...registerEdit("name")}
                error={!!editErrors.name}
                helperText={editErrors.name?.message}
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              />

              <TextField
                label="Số điện thoại"
                {...registerEdit("phone")}
                error={!!editErrors.phone}
                helperText={editErrors.phone?.message}
              />

              <TextField
                label="Ngày sinh"
                type="date"
                {...registerEdit("dateOfBirth")}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <Controller
                name="gender"
                control={controlEdit}
                render={({ field }) => (
                  <TextField
                    select
                    label="Giới tính"
                    {...field}
                    value={field.value ?? ""}
                  >
                    <MenuItem value="">Không chọn</MenuItem>

                    <MenuItem value="MALE">Nam</MenuItem>

                    <MenuItem value="FEMALE">Nữ</MenuItem>

                    <MenuItem value="OTHER">Khác</MenuItem>
                  </TextField>
                )}
              />

              <TextField
                label="Avatar URL"
                {...registerEdit("avatar")}
                error={!!editErrors.avatar}
                helperText={editErrors.avatar?.message}
              />

              <TextField
                label="Số năm kinh nghiệm"
                type="number"
                required
                {...registerEdit("experience", {
                  valueAsNumber: true,
                })}
                error={!!editErrors.experience}
                helperText={editErrors.experience?.message}
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              />

              <TextField
                label="Giới thiệu"
                multiline
                rows={3}
                {...registerEdit("bio")}
              />

              <Controller
                name="specialtyIds"
                control={controlEdit}
                render={({ field }) => (
                  <FormControl error={!!editErrors.specialtyIds}>
                    <InputLabel>Chuyên khoa</InputLabel>

                    <Select
                      multiple
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
                      input={<OutlinedInput label="Chuyên khoa" />}
                      renderValue={(selected) =>
                        specialties
                          .filter((specialty) =>
                            selected.includes(specialty.id),
                          )
                          .map((specialty) => specialty.name)
                          .join(", ")
                      }
                    >
                      {specialties.map((specialty) => (
                        <MenuItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </MenuItem>
                      ))}
                    </Select>

                    {editErrors.specialtyIds && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "error.main",
                          mt: 0.5,
                          ml: 1.5,
                        }}
                      >
                        {editErrors.specialtyIds.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              p: 3,
            }}
          >
            <Button
              onClick={handleCloseEdit}
              sx={{
                textTransform: "none",
              }}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isEditingSubmitting}
              sx={{
                textTransform: "none",
              }}
            >
              {isEditingSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default AdminDoctorsPage;

import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  useForm,
} from "react-hook-form";

import {
  yupResolver,
} from "@hookform/resolvers/yup";

import axios from "axios";

import type {
  Specialty,
} from "../../types/doctor";

import {
  specialtySchema,
  type SpecialtyFormData,
} from "../../schemas/adminSpecialtySchema";

import {
  createSpecialty,
  deleteSpecialty,
  getAdminSpecialties,
  updateSpecialty,
} from "../../services/adminSpecialtyService";

import {
  useAuth,
} from "../../context/AuthContext";

function AdminSpecialtiesPage() {
  const { user } = useAuth();

  const [
    specialties,
    setSpecialties,
  ] = useState<Specialty[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    editingSpecialty,
    setEditingSpecialty,
  ] = useState<Specialty | null>(
    null
  );

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<SpecialtyFormData>({
    resolver: yupResolver(
      specialtySchema
    ),

    defaultValues: {
      name: "",
      description: "",
    },
  });

  const loadSpecialties =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminSpecialties();

        setSpecialties(
          response.data
        );
      } catch (error) {
        console.error(
          "Load specialties:",
          error
        );

        setError(
          "Không thể tải danh sách chuyên khoa"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadSpecialties();
  }, []);

  const handleOpenCreate =
    () => {
      setEditingSpecialty(
        null
      );

      reset({
        name: "",
        description: "",
      });

      setOpen(true);
    };

  const handleOpenEdit = (
    specialty: Specialty
  ) => {
    setEditingSpecialty(
      specialty
    );

    reset({
      name: specialty.name,
      description:
        specialty.description ||
        "",
    });

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSpecialty(
      null
    );

    reset();
  };

  const onSubmit = async (
    data: SpecialtyFormData
  ) => {
    try {
      setError("");
      setSuccess("");

      const payload = {
        name: data.name,
        description:
          data.description ||
          undefined,
      };

      if (editingSpecialty) {
        await updateSpecialty(
          editingSpecialty.id,
          payload
        );

        setSuccess(
          "Cập nhật chuyên khoa thành công"
        );
      } else {
        await createSpecialty(
          payload
        );

        setSuccess(
          "Thêm chuyên khoa thành công"
        );
      }

      handleClose();

      await loadSpecialties();
    } catch (error: unknown) {
      console.error(
        "Save specialty:",
        error
      );

      if (
        axios.isAxiosError(error)
      ) {
        setError(
          error.response?.data
            ?.message ||
            "Không thể lưu chuyên khoa"
        );
      } else {
        setError(
          "Không thể lưu chuyên khoa"
        );
      }
    }
  };

  const handleDelete =
    async (
      specialtyId: number
    ) => {
      const confirmed =
        window.confirm(
          "Bạn có chắc muốn xóa chuyên khoa này?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        setSuccess("");

        await deleteSpecialty(
          specialtyId
        );

        setSuccess(
          "Xóa chuyên khoa thành công"
        );

        await loadSpecialties();
      } catch (error: unknown) {
        console.error(
          "Delete specialty:",
          error
        );

        if (
          axios.isAxiosError(error)
        ) {
          setError(
            error.response?.data
              ?.message ||
              "Không thể xóa chuyên khoa"
          );
        } else {
          setError(
            "Không thể xóa chuyên khoa"
          );
        }
      }
    };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
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
            Quản lý chuyên khoa
          </Typography>

          <Typography
            sx={{
              color:
                "text.secondary",
            }}
          >
            Quản lý các chuyên
            khoa tại PHÒNG KHÁM
            PANDA.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={
            handleOpenCreate
          }
          sx={{
            textTransform:
              "none",
          }}
        >
          Thêm chuyên khoa
        </Button>
      </Box>

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            justifyContent:
              "center",
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
              md:
                "repeat(2, 1fr)",
              lg:
                "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {specialties.map(
            (specialty) => (
              <Paper
                key={
                  specialty.id
                }
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection:
                    "column",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {
                    specialty.name
                  }
                </Typography>

                <Typography
                  sx={{
                    color:
                      "text.secondary",
                    mb: 3,
                    flexGrow: 1,
                  }}
                >
                  {specialty.description ||
                    "Chưa có mô tả"}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() =>
                      handleOpenEdit(
                        specialty
                      )
                    }
                    sx={{
                      textTransform:
                        "none",
                    }}
                  >
                    Chỉnh sửa
                  </Button>

                  {user?.role ===
                    "ADMIN" && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        handleDelete(
                          specialty.id
                        )
                      }
                      sx={{
                        textTransform:
                          "none",
                      }}
                    >
                      Xóa
                    </Button>
                  )}
                </Box>
              </Paper>
            )
          )}
        </Box>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <Box
          component="form"
          onSubmit={handleSubmit(
            onSubmit
          )}
        >
          <DialogTitle>
            {editingSpecialty
              ? "Chỉnh sửa chuyên khoa"
              : "Thêm chuyên khoa"}
          </DialogTitle>

          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 2,
                pt: 1,
              }}
            >
              <TextField
                label="Tên chuyên khoa"
                required
                {...register(
                  "name"
                )}
                error={
                  !!errors.name
                }
                helperText={
                  errors.name
                    ?.message
                }
                sx={{
                  "& .MuiFormLabel-asterisk":
                    {
                      color:
                        "red",
                    },
                }}
              />

              <TextField
                label="Mô tả"
                multiline
                rows={4}
                {...register(
                  "description"
                )}
                error={
                  !!errors.description
                }
                helperText={
                  errors.description
                    ?.message
                }
              />
            </Box>
          </DialogContent>

          <DialogActions
            sx={{ p: 3 }}
          >
            <Button
              onClick={
                handleClose
              }
              sx={{
                textTransform:
                  "none",
              }}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={
                isSubmitting
              }
              sx={{
                textTransform:
                  "none",
              }}
            >
              {isSubmitting
                ? "Đang lưu..."
                : editingSpecialty
                  ? "Lưu thay đổi"
                  : "Thêm chuyên khoa"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default AdminSpecialtiesPage;
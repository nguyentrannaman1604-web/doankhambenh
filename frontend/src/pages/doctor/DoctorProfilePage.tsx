import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import {
  getDoctorProfile,
  updateDoctorProfile,
  type DoctorProfile,
} from "../../services/doctorProfileService";

interface FormData {
  name: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
  bio: string;
}

const initialForm: FormData = {
  name: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  avatar: "",
  bio: "",
};

function DoctorProfilePage() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);

  const [formData, setFormData] = useState<FormData>(initialForm);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =========================
  // LOAD PROFILE
  // =========================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDoctorProfile();

      const doctor = response.data;

      setProfile(doctor);

      setFormData({
        name: doctor.user.name ?? "",

        phone: doctor.user.phone ?? "",

        dateOfBirth: doctor.user.dateOfBirth
          ? doctor.user.dateOfBirth.slice(0, 10)
          : "",

        gender: doctor.user.gender ?? "",

        avatar: doctor.user.avatar ?? "",

        bio: doctor.bio ?? "",
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể tải hồ sơ bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event: {
    target: {
      name: string;
      value: string;
    };
  }) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // =========================
      // VALIDATE NAME
      // =========================

      if (formData.name.trim().length < 2) {
        setError("Tên phải có ít nhất 2 ký tự");

        return;
      }

      // =========================
      // UPDATE
      // =========================

      const response = await updateDoctorProfile({
        name: formData.name.trim(),

        phone: formData.phone.trim() || null,

        dateOfBirth: formData.dateOfBirth || null,

        gender: formData.gender
          ? (formData.gender as "MALE" | "FEMALE" | "OTHER")
          : null,

        avatar: formData.avatar.trim() || null,

        bio: formData.bio.trim() || null,
      });

      setProfile(response.data);

      setSuccess(response.message || "Cập nhật hồ sơ thành công");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Cập nhật hồ sơ thất bại");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =========================
  // PROFILE NOT FOUND
  // =========================

  if (!profile) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 5,
        }}
      >
        <Alert severity="error">{error || "Không tìm thấy hồ sơ bác sĩ"}</Alert>
      </Container>
    );
  }

  const avatarLetter = profile.user.name?.trim().charAt(0).toUpperCase() || "B";

  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "#f7fbff",

        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <Container maxWidth="lg">
        {/* =========================
            TITLE
        ========================== */}

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,

            color: "#14324a",

            mb: 1,
          }}
        >
          Hồ sơ của tôi
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",

            mb: 4,
          }}
        >
          Xem và cập nhật thông tin cá nhân của bác sĩ.
        </Typography>

        {/* =========================
            ALERT
        ========================== */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
            }}
          >
            {success}
          </Alert>
        )}

        {/* =========================
            MAIN GRID
        ========================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "320px 1fr",
            },

            gap: 3,
          }}
        >
          {/* =========================
              LEFT PROFILE CARD
          ========================== */}

          <Paper
            elevation={0}
            sx={{
              p: 3,

              borderRadius: 3,

              border: "1px solid #e6edf3",

              bgcolor: "white",

              height: "fit-content",
            }}
          >
            <Box
              sx={{
                display: "flex",

                flexDirection: "column",

                alignItems: "center",
              }}
            >
              {/* AVATAR */}

              <Avatar
                src={formData.avatar || undefined}
                sx={{
                  width: 130,

                  height: 130,

                  fontSize: 50,

                  fontWeight: 700,

                  bgcolor: "#1687c9",

                  mb: 2,
                }}
              >
                {avatarLetter}
              </Avatar>

              {/* NAME */}

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,

                  textAlign: "center",

                  color: "#14324a",
                }}
              >
                {formData.name}
              </Typography>

              {/* EMAIL */}

              <Typography
                sx={{
                  color: "text.secondary",

                  textAlign: "center",

                  mt: 0.5,
                }}
              >
                {profile.user.email}
              </Typography>

              {/* ROLE */}

              <Chip
                label="Bác sĩ"
                size="small"
                sx={{
                  mt: 2,

                  fontWeight: 700,

                  bgcolor: "#e5f5ff",

                  color: "#0877bd",
                }}
              />

              {/* SPECIALTIES */}

              {profile.specialties.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  {profile.specialties.map((item) => (
                    <Chip
                      key={item.specialty.id}
                      label={item.specialty.name}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* =========================
                EXPERIENCE
            ========================== */}

            <Box
              sx={{
                mt: 4,

                pt: 3,

                borderTop: "1px solid #edf1f5",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",

                  mb: 0.5,
                }}
              >
                Kinh nghiệm
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,

                  color: "#14324a",
                }}
              >
                {profile.experience != null
                  ? `${profile.experience} năm`
                  : "Chưa cập nhật"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",

                  mt: 2,

                  lineHeight: 1.6,
                }}
              >
                Số năm kinh nghiệm do quản trị viên quản lý. Bác sĩ không thể tự
                thay đổi thông tin này.
              </Typography>
            </Box>
          </Paper>

          {/* =========================
              FORM
          ========================== */}

          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={0}
            sx={{
              p: {
                xs: 3,
                md: 4,
              },

              borderRadius: 3,

              border: "1px solid #e6edf3",

              bgcolor: "white",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,

                color: "#14324a",

                mb: 3,
              }}
            >
              Thông tin cá nhân
            </Typography>

            {/* =========================
                FORM GRID
            ========================== */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },

                gap: 3,
              }}
            >
              {/* NAME */}

              <TextField
                label="Họ và tên"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              />

              {/* EMAIL */}

              <TextField
                label="Email"
                value={profile.user.email}
                disabled
                fullWidth
                helperText="Email tài khoản không thể tự thay đổi"
              />

              {/* PHONE */}

              <TextField
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                placeholder="Ví dụ: 0901234567"
              />

              {/* DATE OF BIRTH */}

              <TextField
                label="Ngày sinh"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              {/* GENDER */}

              <TextField
                select
                label="Giới tính"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Chưa chọn</MenuItem>

                <MenuItem value="MALE">Nam</MenuItem>

                <MenuItem value="FEMALE">Nữ</MenuItem>

                <MenuItem value="OTHER">Khác</MenuItem>
              </TextField>

              {/* AVATAR */}

              <TextField
                label="Ảnh đại diện"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                fullWidth
                placeholder="https://..."
                helperText="Nhập URL hình ảnh đại diện"
              />
            </Box>

            {/* =========================
                AVATAR PREVIEW
            ========================== */}

            {formData.avatar && (
              <Box
                sx={{
                  mt: 3,

                  p: 2,

                  bgcolor: "#f7fbff",

                  borderRadius: 2,

                  border: "1px solid #e6edf3",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,

                    color: "#14324a",

                    mb: 1.5,
                  }}
                >
                  Xem trước ảnh đại diện
                </Typography>

                <Avatar
                  src={formData.avatar}
                  sx={{
                    width: 90,

                    height: 90,

                    bgcolor: "#1687c9",

                    fontSize: 32,

                    fontWeight: 700,
                  }}
                >
                  {avatarLetter}
                </Avatar>
              </Box>
            )}

            {/* =========================
                BIO
            ========================== */}

            <TextField
              label="Giới thiệu bản thân"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              multiline
              minRows={5}
              fullWidth
              sx={{
                mt: 3,
              }}
              placeholder="Giới thiệu ngắn về chuyên môn và quá trình làm việc..."
            />

            {/* =========================
                SUBMIT
            ========================== */}

            <Box
              sx={{
                mt: 4,

                display: "flex",

                justifyContent: "flex-end",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={saving}
                sx={{
                  minWidth: 190,

                  py: 1.4,

                  textTransform: "none",

                  fontWeight: 700,

                  borderRadius: 2,
                }}
              >
                {saving ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default DoctorProfilePage;

import { useEffect, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";

import type { Doctor, Specialty } from "../../types/doctor";

import { getDoctors } from "../../services/doctorService";

import { getSpecialties } from "../../services/specialtyService";

import { Link } from "react-router-dom";

interface DoctorCardProps {
  doctor: Doctor;
}

function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",

        transition: "0.2s ease",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 5,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <Avatar
          src={doctor.user.avatar || undefined}
          alt={doctor.user.name}
          sx={{
            width: 72,
            height: 72,
          }}
        >
          {doctor.user.name.charAt(0).toUpperCase()}
        </Avatar>

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {doctor.user.name}
          </Typography>

          <Typography
            sx={{
              color: "primary.main",
              fontWeight: 500,
            }}
          >
            {doctor.specialties.map((item) => item.specialty.name).join(", ")}
          </Typography>
        </Box>
      </Box>

      {/* KINH NGHIỆM */}

      <Typography
        sx={{
          mb: 1,
        }}
      >
        <strong>Kinh nghiệm:</strong>{" "}
        {doctor.experience ? `${doctor.experience} năm` : "Đang cập nhật"}
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          mb: 3,
          flexGrow: 1,
        }}
      >
        {doctor.bio || "Thông tin bác sĩ đang được cập nhật."}
      </Typography>

      <Button
        component={Link}
        to={`/patient/doctors/${doctor.id}`}
        variant="contained"
        fullWidth
        sx={{
          textTransform: "none",
        }}
      >
        Xem chi tiết
      </Button>
    </Paper>
  );
}

function DoctorListPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const response = await getSpecialties();

        setSpecialties(response.data);
      } catch (error) {
        console.error("Load specialties error:", error);

        setError("Không thể tải danh sách chuyên khoa");
      }
    };

    loadSpecialties();
  }, []);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const specialtyId = selectedSpecialty
          ? Number(selectedSpecialty)
          : undefined;

        const response = await getDoctors(specialtyId);

        setDoctors(response.data);
      } catch (error) {
        console.error("Load doctors error:", error);

        setError("Không thể tải danh sách bác sĩ");
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [selectedSpecialty]);

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Tìm bác sĩ
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          Lựa chọn bác sĩ và chuyên khoa phù hợp với nhu cầu của bạn.
        </Typography>
      </Box>

      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Chuyên khoa
        </Typography>

        <FormControl
          fullWidth
          sx={{
            maxWidth: 400,
          }}
        >
          <InputLabel>Chọn chuyên khoa</InputLabel>

          <Select
            value={selectedSpecialty}
            label="Chọn chuyên khoa"
            onChange={(event) => setSelectedSpecialty(event.target.value)}
          >
            <MenuItem value="">Tất cả chuyên khoa</MenuItem>

            {specialties.map((specialty) => (
              <MenuItem key={specialty.id} value={specialty.id}>
                {specialty.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

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
      ) : doctors.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
          }}
        >
          <Typography color="text.secondary">
            Không tìm thấy bác sĩ phù hợp.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },

            gap: 3,
          }}
        >
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default DoctorListPage;

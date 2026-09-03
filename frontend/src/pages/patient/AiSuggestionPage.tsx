import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { useNavigate } from "react-router-dom";

import {
  aiSuggestionSchema,
  type AiSuggestionFormData,
} from "../../schemas/aiSchema";

import { suggestSpecialty } from "../../services/aiService";

import type { AiSuggestion } from "../../types/ai";

function AiSuggestionPage() {
  const navigate = useNavigate();

  const [result, setResult] = useState<AiSuggestion | null>(null);

  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AiSuggestionFormData>({
    resolver: yupResolver(aiSuggestionSchema),

    defaultValues: {
      symptoms: "",
    },
  });

  const onSubmit = async (data: AiSuggestionFormData) => {
    try {
      setError("");
      setResult(null);

      const response = await suggestSpecialty(data);

      setResult(response.data);
    } catch (error: any) {
      console.error("AI suggestion error:", error);

      setError(error.response?.data?.message || "Không thể nhận gợi ý từ AI");
    }
  };

  const handleViewDoctors = () => {
    if (!result) {
      return;
    }

    navigate(`/patient/doctors?specialtyId=${result.specialtyId}`);
  };

  return (
    <Box
      sx={{
        maxWidth: 850,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          mb: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          AI gợi ý chuyên khoa
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          Mô tả triệu chứng của bạn để nhận gợi ý chuyên khoa phù hợp.
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: {
            xs: 3,
            md: 4,
          },
          borderRadius: 3,
          mb: 3,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="symptoms"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Triệu chứng"
                placeholder="Ví dụ: Tôi bị đau bụng, buồn nôn và khó tiêu từ hôm qua..."
                fullWidth
                multiline
                minRows={5}
                required
                error={!!errors.symptoms}
                helperText={errors.symptoms?.message}
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              mt: 3,
              textTransform: "none",
              minWidth: 180,
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress
                  size={20}
                  sx={{
                    mr: 1,
                    color: "inherit",
                  }}
                />
                Đang phân tích...
              </>
            ) : (
              "Gợi ý chuyên khoa"
            )}
          </Button>
        </form>
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

      {result && (
        <Paper
          elevation={2}
          sx={{
            p: {
              xs: 3,
              md: 4,
            },
            borderRadius: 3,
          }}
        >
          <Typography
            sx={{
              color: "text.secondary",
              mb: 1,
            }}
          >
            Chuyên khoa được gợi ý
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              mb: 3,
            }}
          >
            {result.specialty}
          </Typography>

          <Typography
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Lý do
          </Typography>

          <Typography
            sx={{
              lineHeight: 1.7,
              mb: 3,
            }}
          >
            {result.reason}
          </Typography>

          <Alert
            severity="warning"
            sx={{
              mb: 3,
            }}
          >
            {result.disclaimer}
          </Alert>

          <Button
            variant="contained"
            onClick={handleViewDoctors}
            sx={{
              textTransform: "none",
            }}
          >
            Xem bác sĩ {result.specialty}
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default AiSuggestionPage;

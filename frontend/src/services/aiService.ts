import api from "../api/axiosClient";

import type {
  AiSuggestionResponse,
} from "../types/ai";

import type {
  AiSuggestionFormData,
} from "../schemas/aiSchema";

export async function suggestSpecialty(
  data: AiSuggestionFormData
) {
  const response =
    await api.post<AiSuggestionResponse>(
      "/ai/suggest-specialty",
      data
    );

  return response.data;
}
export interface AiSuggestion {
  type: "SPECIALTY";
  specialtyId: number;
  specialty: string;
  reason: string;
  disclaimer: string;
}

export interface AiSuggestionResponse {
  success: boolean;
  message?: string;
  data: AiSuggestion;
}

export interface AiSuggestionInput {
  symptoms: string;
}
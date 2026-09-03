import * as yup from "yup";
export const aiSuggestionSchema =
  yup.object({
    symptoms: yup
      .string()
      .trim()
      .required(
        "Vui lòng nhập triệu chứng"
      )
      .min(
        10,
        "Triệu chứng cần ít nhất 10 ký tự"
      )
      .max(
        1000,
        "Triệu chứng không được vượt quá 1000 ký tự"
      ),
  });

export type AiSuggestionFormData =
  yup.InferType<
    typeof aiSuggestionSchema
  >;
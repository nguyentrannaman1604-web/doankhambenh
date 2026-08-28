import * as yup from "yup";

export const suggestSpecialtySchema = yup.object({
  symptoms: yup
    .string()
    .trim()
    .min(5, "Triệu chứng phải có ít nhất 5 ký tự")
    .max(1000, "Triệu chứng không được vượt quá 1000 ký tự")
    .required("Triệu chứng là bắt buộc"),
});
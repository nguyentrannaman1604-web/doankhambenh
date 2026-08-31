import * as yup from "yup";

export const specialtySchema = yup.object({
  name: yup
    .string()
    .required("Tên chuyên khoa là bắt buộc")
    .max(100, "Tên chuyên khoa tối đa 100 ký tự"),

  description: yup
    .string()
    .optional()
    .max(500, "Mô tả tối đa 500 ký tự"),
});

export type SpecialtyFormData =
  yup.InferType<typeof specialtySchema>;
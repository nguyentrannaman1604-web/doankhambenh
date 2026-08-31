import * as yup from "yup";

export const reviewSchema = yup.object({
  rating: yup
    .number()
    .required("Vui lòng chọn số sao")
    .integer("Số sao phải là số nguyên")
    .min(1, "Đánh giá tối thiểu 1 sao")
    .max(5, "Đánh giá tối đa 5 sao"),

  comment: yup
    .string()
    .optional()
    .max(
      1000,
      "Nhận xét tối đa 1000 ký tự"
    ),
});

export type ReviewFormData =
  yup.InferType<typeof reviewSchema>;
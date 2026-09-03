import * as yup from "yup";
const vietnamPhoneRegex =
  /^(?:03[2-9]|05[2689]|07[06789]|08[1-689]|09[0-46-9])\d{7}$/;
const genderSchema = yup
  .mixed<"MALE" | "FEMALE" | "OTHER">()
  .oneOf(
    ["MALE", "FEMALE", "OTHER"],
    "Giới tính phải là MALE, FEMALE hoặc OTHER",
  );

export const registerPatientSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên tối đa 100 ký tự")
    .required("Tên là bắt buộc"),

  email: yup
    .string()
    .trim()
    .email("Email không hợp lệ")
    .required("Email là bắt buộc"),

  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),

  phone: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .matches(vietnamPhoneRegex, "Số điện thoại Việt Nam không hợp lệ")
    .optional(),

  dateOfBirth: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),

  gender: yup
    .mixed<"MALE" | "FEMALE" | "OTHER">()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .oneOf(
      ["MALE", "FEMALE", "OTHER"],
      "Giới tính phải là MALE, FEMALE hoặc OTHER",
    )
    .optional(),

  avatar: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .url("Avatar phải là URL hợp lệ")
    .optional(),
});

export const updatePatientProfileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên tối đa 100 ký tự")
    .optional(),

  phone: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .matches(vietnamPhoneRegex, "Số điện thoại Việt Nam không hợp lệ")
    .nullable()
    .optional(),

  dateOfBirth: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .optional(),

  gender: yup
    .mixed<"MALE" | "FEMALE" | "OTHER">()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .oneOf(
      ["MALE", "FEMALE", "OTHER"],
      "Giới tính phải là MALE, FEMALE hoặc OTHER",
    )
    .optional(),

  avatar: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .url("Avatar phải là URL hợp lệ")
    .nullable()
    .optional(),
});

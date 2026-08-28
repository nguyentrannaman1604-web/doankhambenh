import * as yup from "yup";

const vietnamPhoneRegex =
  /^(?:03[2-9]|05[2689]|07[06789]|08[1-689]|09[0-46-9])\d{7}$/;

export const createDoctorSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Tên bác sĩ phải có ít nhất 2 ký tự")
    .max(100, "Tên bác sĩ tối đa 100 ký tự")
    .required("Tên bác sĩ là bắt buộc"),

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

  experience: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Số năm kinh nghiệm phải là số")
    .integer("Số năm kinh nghiệm phải là số nguyên")
    .min(0, "Số năm kinh nghiệm không được âm")
    .max(70, "Số năm kinh nghiệm không hợp lệ")
    .optional(),

  bio: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .max(2000, "Bio tối đa 2000 ký tự")
    .optional(),

  specialtyIds: yup
    .array()
    .of(
      yup
        .number()
        .typeError("Specialty ID phải là số")
        .integer("Specialty ID phải là số nguyên")
        .positive("Specialty ID phải lớn hơn 0")
        .required("Specialty ID là bắt buộc"),
    )
    .min(1, "Bác sĩ phải có ít nhất một chuyên khoa")
    .required("specialtyIds là bắt buộc"),
});

export const updateDoctorSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Tên bác sĩ phải có ít nhất 2 ký tự")
    .max(100, "Tên bác sĩ tối đa 100 ký tự")
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

  experience: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Số năm kinh nghiệm phải là số")
    .integer("Số năm kinh nghiệm phải là số nguyên")
    .min(0, "Số năm kinh nghiệm không được âm")
    .max(70, "Số năm kinh nghiệm không hợp lệ")
    .optional(),

  bio: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .max(2000, "Bio tối đa 2000 ký tự")
    .nullable()
    .optional(),

  specialtyIds: yup
    .array()
    .of(
      yup
        .number()
        .typeError("Specialty ID phải là số")
        .integer("Specialty ID phải là số nguyên")
        .positive("Specialty ID phải lớn hơn 0")
        .required("Specialty ID là bắt buộc"),
    )
    .min(1, "Bác sĩ phải có ít nhất một chuyên khoa")
    .optional(),
});

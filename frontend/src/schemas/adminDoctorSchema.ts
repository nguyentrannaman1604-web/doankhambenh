import * as yup from "yup";

const vietnamPhoneRegex =
  /^(?:03[2-9]|05[2689]|07[06789]|08[1-689]|09[0-46-9])\d{7}$/;

export const createDoctorSchema = yup.object({
  name: yup
    .string()
    .required("Họ tên bác sĩ là bắt buộc")
    .max(100, "Họ tên tối đa 100 ký tự"),

  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),

  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),

  phone: yup
    .string()
    .optional()
    .test("phone", "Số điện thoại Việt Nam không hợp lệ", (value) => {
      if (!value) return true;
      return vietnamPhoneRegex.test(value);
    }),

  dateOfBirth: yup.string().optional(),

  gender: yup
    .mixed<"MALE" | "FEMALE" | "OTHER">()
    .oneOf(["MALE", "FEMALE", "OTHER"])
    .optional(),

  avatar: yup
    .string()
    .optional()
    .test("url", "Avatar phải là URL hợp lệ", (value) => {
      if (!value) return true;

      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),

  experience: yup
    .number()
    .typeError("Kinh nghiệm phải là số")
    .required("Số năm kinh nghiệm là bắt buộc")
    .min(0, "Kinh nghiệm không được âm")
    .max(70, "Số năm kinh nghiệm không hợp lệ"),

  bio: yup.string().optional(),

  specialtyIds: yup
    .array()
    .of(yup.number().required())
    .min(1, "Bác sĩ phải thuộc ít nhất một chuyên khoa")
    .required("Vui lòng chọn chuyên khoa"),
});

export type CreateDoctorFormData = yup.InferType<typeof createDoctorSchema>;

export const updateDoctorSchema = yup.object({
  name: yup
    .string()
    .required("Họ tên bác sĩ là bắt buộc")
    .max(100, "Họ tên tối đa 100 ký tự"),

  phone: yup
    .string()
    .optional()
    .test("phone", "Số điện thoại Việt Nam không hợp lệ", (value) => {
      if (!value) return true;

      return vietnamPhoneRegex.test(value);
    }),

  dateOfBirth: yup.string().optional(),

  gender: yup
    .mixed<"MALE" | "FEMALE" | "OTHER">()
    .oneOf(["MALE", "FEMALE", "OTHER"])
    .optional(),

  avatar: yup
    .string()
    .optional()
    .test("url", "Avatar phải là URL hợp lệ", (value) => {
      if (!value) return true;

      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),

  experience: yup
    .number()
    .typeError("Kinh nghiệm phải là số")
    .required("Số năm kinh nghiệm là bắt buộc")
    .min(0, "Kinh nghiệm không được âm")
    .max(70, "Số năm kinh nghiệm không hợp lệ"),

  bio: yup.string().optional(),

  specialtyIds: yup
    .array()
    .of(yup.number().required())
    .min(1, "Bác sĩ phải thuộc ít nhất một chuyên khoa")
    .required("Vui lòng chọn chuyên khoa"),
});

export type UpdateDoctorFormData = yup.InferType<typeof updateDoctorSchema>;

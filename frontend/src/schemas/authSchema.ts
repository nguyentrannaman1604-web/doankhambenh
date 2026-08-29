import * as yup from "yup";



const emailRegex =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/;



const vietnamPhoneRegex =
  /^(?:03[2-9]|05[2689]|07[06789]|08[1-689]|09[0-46-9])\d{7}$/;



export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email là bắt buộc")
    .email("Email không hợp lệ")
    .matches(emailRegex, "Email không đúng định dạng"),

  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;



export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Họ tên là bắt buộc")
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được vượt quá 100 ký tự"),

  email: yup
    .string()
    .trim()
    .required("Email là bắt buộc")
    .email("Email không hợp lệ")
    .matches(emailRegex, "Email không đúng định dạng"),

  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),

  phone: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .trim()
    .matches(vietnamPhoneRegex, "Số điện thoại Việt Nam không hợp lệ")
    .optional(),

  dateOfBirth: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .test("valid-date", "Ngày sinh không hợp lệ", (value) => {
      if (!value) {
        return true;
      }

      const date = new Date(value);

      return !Number.isNaN(date.getTime());
    })
    .test("not-future", "Ngày sinh không được ở tương lai", (value) => {
      if (!value) {
        return true;
      }

      const selectedDate = new Date(value);

      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);

      today.setHours(0, 0, 0, 0);

      return selectedDate <= today;
    })
    .optional(),

  gender: yup
    .mixed<"MALE" | "FEMALE" | "OTHER">()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .oneOf(["MALE", "FEMALE", "OTHER"], "Giới tính không hợp lệ")
    .optional(),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;

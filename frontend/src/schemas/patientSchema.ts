import * as yup from "yup";

const vietnamPhoneRegex =
  /^(?:03[2-9]|05[2689]|07[06789]|08[1-689]|09[0-46-9])\d{7}$/;

export const patientProfileSchema =
  yup.object({
    name: yup
      .string()
      .trim()
      .required("Họ tên là bắt buộc")
      .min(
        2,
        "Họ tên phải có ít nhất 2 ký tự"
      )
      .max(
        100,
        "Họ tên không được vượt quá 100 ký tự"
      ),

    phone: yup
      .string()
      .transform(
        (value, originalValue) =>
          originalValue === ""
            ? undefined
            : value
      )
      .matches(
        vietnamPhoneRegex,
        "Số điện thoại Việt Nam không hợp lệ"
      )
      .optional(),

    dateOfBirth: yup
      .string()
      .transform(
        (value, originalValue) =>
          originalValue === ""
            ? undefined
            : value
      )
      .test(
        "not-future",
        "Ngày sinh không được ở tương lai",
        (value) => {
          if (!value) {
            return true;
          }

          const selectedDate =
            new Date(value);

          const today =
            new Date();

          selectedDate.setHours(
            0,
            0,
            0,
            0
          );

          today.setHours(
            0,
            0,
            0,
            0
          );

          return (
            selectedDate <= today
          );
        }
      )
      .optional(),

    gender: yup
      .mixed<
        "MALE" |
        "FEMALE" |
        "OTHER"
      >()
      .transform(
        (value, originalValue) =>
          originalValue === ""
            ? undefined
            : value
      )
      .oneOf(
        [
          "MALE",
          "FEMALE",
          "OTHER",
        ],
        "Giới tính không hợp lệ"
      )
      .optional(),
  });

export type PatientProfileFormData =
  yup.InferType<
    typeof patientProfileSchema
  >;
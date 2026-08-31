import * as yup from "yup";

export const blockedSlotSchema =
  yup.object({
    date: yup
      .string()
      .required(
        "Vui lòng chọn ngày"
      ),

    startTime: yup
      .string()
      .required(
        "Vui lòng chọn giờ bắt đầu"
      ),

    endTime: yup
      .string()
      .required(
        "Vui lòng chọn giờ kết thúc"
      )
      .test(
        "end-after-start",
        "Giờ kết thúc phải sau giờ bắt đầu",
        function (value) {
          const {
            startTime,
          } = this.parent;

          if (
            !value ||
            !startTime
          ) {
            return true;
          }

          return (
            value > startTime
          );
        }
      ),

    reason: yup
      .string()
      .trim()
      .max(
        255,
        "Lý do không được vượt quá 255 ký tự"
      )
      .optional(),
  });

export type BlockedSlotFormData =
  yup.InferType<
    typeof blockedSlotSchema
  >;
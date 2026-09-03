import * as yup from "yup";
export const doctorScheduleSchema =
  yup.object({
    dayOfWeek: yup
      .number()
      .required("Vui lòng chọn ngày làm việc")
      .integer()
      .min(0, "Ngày không hợp lệ")
      .max(6, "Ngày không hợp lệ"),

    startTime: yup
      .string()
      .required("Vui lòng chọn giờ bắt đầu")
      .matches(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Giờ bắt đầu không hợp lệ"
      ),

    endTime: yup
      .string()
      .required("Vui lòng chọn giờ kết thúc")
      .matches(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Giờ kết thúc không hợp lệ"
      )
      .test(
        "end-after-start",
        "Giờ kết thúc phải lớn hơn giờ bắt đầu",
        function (value) {
          const { startTime } =
            this.parent;

          if (
            !value ||
            !startTime
          ) {
            return true;
          }

          return value > startTime;
        }
      ),

    slotDuration: yup
      .number()
      .typeError(
        "Thời lượng phải là số"
      )
      .required(
        "Vui lòng nhập thời lượng"
      )
      .integer(
        "Thời lượng phải là số nguyên"
      )
      .min(
        10,
        "Thời lượng tối thiểu 10 phút"
      )
      .max(
        180,
        "Thời lượng tối đa 180 phút"
      ),
  });

export type DoctorScheduleFormData =
  yup.InferType<
    typeof doctorScheduleSchema
  >;
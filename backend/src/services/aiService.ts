import { ai, GEMINI_MODEL } from "../lib/gemini.js";

import prisma from "../lib/prisma.js";
import { AppError } from "../types/AppError.js";

interface SpecialtySuggestion {
  type: "SPECIALTY" | "GENERAL" | "URGENT";
  specialtyId: number | null;
  specialty: string | null;
  reason: string;
  disclaimer: string;
}

export async function suggestSpecialty(
  symptoms: string,
): Promise<SpecialtySuggestion> {
  try {
    const specialties = await prisma.specialty.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    if (specialties.length === 0) {
      throw new AppError("Hệ thống chưa có chuyên khoa", 400);
    }

    const generalSpecialty = specialties.find(
      (item) => item.name.trim().toLowerCase() === "nội tổng quát",
    );

    const specialtyList = specialties
      .map(
        (item) =>
          `ID: ${item.id}
Tên: ${item.name}
Mô tả: ${item.description ?? "Không có mô tả"}`,
      )
      .join("\n\n");

    const prompt = `
Bạn là trợ lý hỗ trợ phân luồng bệnh nhân
cho một phòng khám tư nhân.

NHIỆM VỤ:

Dựa vào triệu chứng bệnh nhân cung cấp,
hãy lựa chọn chuyên khoa phù hợp nhất
TRONG DANH SÁCH CHUYÊN KHOA CỦA PHÒNG KHÁM.

Danh sách chuyên khoa:

${specialtyList}

QUY TẮC:

1. Chỉ được chọn specialtyId có trong danh sách trên.

2. Nếu có một chuyên khoa phù hợp rõ ràng:
type = "SPECIALTY"

3. Nếu triệu chứng chung chung, chưa đủ rõ để
chọn chuyên khoa cụ thể:
type = "GENERAL"

Nếu trong danh sách có "Nội tổng quát",
hãy chọn specialtyId của Nội tổng quát.

4. Nếu mô tả cho thấy người dùng có thể cần
được đánh giá y tế khẩn cấp:
type = "URGENT"
specialtyId = null

5. Không chẩn đoán bệnh.

6. Không kê đơn thuốc.

7. Không khẳng định bệnh nhân mắc bệnh cụ thể.

8. reason phải ngắn gọn, dễ hiểu bằng tiếng Việt.

Triệu chứng bệnh nhân:

"${symptoms}"

Chỉ trả về JSON:

{
  "type": "SPECIALTY | GENERAL | URGENT",
  "specialtyId": 1,
  "reason": "Lý do ngắn gọn"
}
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,

      contents: prompt,

      config: {
        temperature: 0.2,
        maxOutputTokens: 300,
        responseMimeType: "application/json",
      },
    });

    console.log("Gemini response:", response.text);

    if (!response.text) {
      throw new AppError("AI không trả về kết quả", 502);
    }

    const result = JSON.parse(response.text);

    if (result.type === "URGENT") {
      return {
        type: "URGENT",

        specialtyId: null,

        specialty: null,

        reason:
          result.reason ||
          "Triệu chứng được mô tả có thể cần được đánh giá y tế khẩn cấp.",

        disclaimer:
          "Đây chỉ là gợi ý tham khảo. Nếu triệu chứng nghiêm trọng hoặc tình trạng xấu đi nhanh, hãy liên hệ cơ sở y tế hoặc dịch vụ cấp cứu phù hợp.",
      };
    }

    let selectedSpecialty = specialties.find(
      (item) => item.id === Number(result.specialtyId),
    );

    if (!selectedSpecialty) {
      selectedSpecialty = generalSpecialty;
    }

    if (!selectedSpecialty) {
      throw new AppError("Không tìm thấy chuyên khoa phù hợp", 400);
    }

    if (result.type === "GENERAL") {
      const general = generalSpecialty ?? selectedSpecialty;

      return {
        type: "GENERAL",

        specialtyId: general.id,

        specialty: general.name,

        reason:
          "Triệu chứng hiện tại chưa đủ đặc hiệu để xác định chuyên khoa cụ thể. Bạn nên được bác sĩ đánh giá ban đầu.",

        disclaimer:
          "Đây chỉ là gợi ý tham khảo, không thay thế chẩn đoán của bác sĩ.",
      };
    }

    return {
      type: "SPECIALTY",

      specialtyId: selectedSpecialty.id,

      specialty: selectedSpecialty.name,

      reason:
        result.reason ||
        `Các triệu chứng được mô tả phù hợp để được đánh giá tại chuyên khoa ${selectedSpecialty.name}.`,

      disclaimer:
        "Đây chỉ là gợi ý tham khảo, không thay thế chẩn đoán của bác sĩ.",
    };
  } catch (error: any) {
    console.error("===== GEMINI ERROR =====");
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(error?.message || "Không thể kết nối dịch vụ AI", 502);
  }
}

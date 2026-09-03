import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🚀 Start seeding...");

  const password = await bcrypt.hash("123456", 10);

  const noiKhoa = await prisma.specialty.upsert({
    where: {
      name: "Nội khoa",
    },
    update: {
      description: "Khám và điều trị các bệnh lý nội khoa tổng quát",
    },
    create: {
      name: "Nội khoa",
      description: "Khám và điều trị các bệnh lý nội khoa tổng quát",
    },
  });

  const noiTongQuat = await prisma.specialty.upsert({
    where: {
      name: "Nội tổng quát",
    },
    update: {
      description:
        "Khám, đánh giá ban đầu và tư vấn các triệu chứng chưa xác định rõ chuyên khoa",
    },
    create: {
      name: "Nội tổng quát",
      description:
        "Khám, đánh giá ban đầu và tư vấn các triệu chứng chưa xác định rõ chuyên khoa",
    },
  });

  const nhiKhoa = await prisma.specialty.upsert({
    where: {
      name: "Nhi khoa",
    },
    update: {
      description: "Khám và điều trị các bệnh lý ở trẻ em",
    },
    create: {
      name: "Nhi khoa",
      description: "Khám và điều trị các bệnh lý ở trẻ em",
    },
  });

  const daLieu = await prisma.specialty.upsert({
    where: {
      name: "Da liễu",
    },
    update: {
      description: "Khám và điều trị các bệnh lý về da, tóc và móng",
    },
    create: {
      name: "Da liễu",
      description: "Khám và điều trị các bệnh lý về da, tóc và móng",
    },
  });

  const thanKinh = await prisma.specialty.upsert({
    where: {
      name: "Thần kinh",
    },
    update: {
      description: "Khám các bệnh lý liên quan đến hệ thần kinh",
    },
    create: {
      name: "Thần kinh",
      description: "Khám các bệnh lý liên quan đến hệ thần kinh",
    },
  });

  const timMach = await prisma.specialty.upsert({
    where: {
      name: "Tim mạch",
    },
    update: {
      description: "Khám và điều trị các bệnh lý tim mạch",
    },
    create: {
      name: "Tim mạch",
      description: "Khám và điều trị các bệnh lý tim mạch",
    },
  });

  console.log("✅ Seed specialties thành công");

  await prisma.user.upsert({
    where: {
      email: "admin@gmail.com",
    },
    update: {
      name: "Admin hệ thống",
      phone: "0900000001",
      role: "ADMIN",
    },
    create: {
      name: "Admin hệ thống",
      email: "admin@gmail.com",
      password,
      phone: "0900000001",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "receptionist@gmail.com",
    },
    update: {
      name: "Lễ tân phòng khám",
      phone: "0900000002",
      role: "RECEPTIONIST",
    },
    create: {
      name: "Lễ tân phòng khám",
      email: "receptionist@gmail.com",
      password,
      phone: "0900000002",
      role: "RECEPTIONIST",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "patient@gmail.com",
    },
    update: {
      name: "Nguyễn Văn Nam",
      phone: "0900000003",
      dateOfBirth: new Date("2000-05-10"),
      gender: "MALE",
      role: "PATIENT",
    },
    create: {
      name: "Nguyễn Văn Nam",
      email: "patient@gmail.com",
      password,
      phone: "0900000003",
      dateOfBirth: new Date("2000-05-10"),
      gender: "MALE",
      role: "PATIENT",
    },
  });

  const doctorUser1 = await prisma.user.upsert({
    where: {
      email: "doctor1@gmail.com",
    },
    update: {
      name: "BS. Nguyễn Văn An",
      phone: "0900000004",
      gender: "MALE",
      role: "DOCTOR",
    },
    create: {
      name: "BS. Nguyễn Văn An",
      email: "doctor1@gmail.com",
      password,
      phone: "0900000004",
      gender: "MALE",
      role: "DOCTOR",
    },
  });

  const doctor1 = await prisma.doctor.upsert({
    where: {
      userId: doctorUser1.id,
    },
    update: {
      experience: 10,
      bio: "Bác sĩ có 10 năm kinh nghiệm trong lĩnh vực Nội khoa và Tim mạch.",
    },
    create: {
      userId: doctorUser1.id,
      experience: 10,
      bio: "Bác sĩ có 10 năm kinh nghiệm trong lĩnh vực Nội khoa và Tim mạch.",
      rating: 0,
    },
  });

  await prisma.doctorSpecialty.upsert({
    where: {
      doctorId_specialtyId: {
        doctorId: doctor1.id,
        specialtyId: noiKhoa.id,
      },
    },
    update: {},
    create: {
      doctorId: doctor1.id,
      specialtyId: noiKhoa.id,
    },
  });

  await prisma.doctorSpecialty.upsert({
    where: {
      doctorId_specialtyId: {
        doctorId: doctor1.id,
        specialtyId: timMach.id,
      },
    },
    update: {},
    create: {
      doctorId: doctor1.id,
      specialtyId: timMach.id,
    },
  });

  const doctorUser2 = await prisma.user.upsert({
    where: {
      email: "doctor2@gmail.com",
    },
    update: {
      name: "BS. Trần Thị Bình",
      phone: "0900000005",
      gender: "FEMALE",
      role: "DOCTOR",
    },
    create: {
      name: "BS. Trần Thị Bình",
      email: "doctor2@gmail.com",
      password,
      phone: "0900000005",
      gender: "FEMALE",
      role: "DOCTOR",
    },
  });

  const doctor2 = await prisma.doctor.upsert({
    where: {
      userId: doctorUser2.id,
    },
    update: {
      experience: 7,
      bio: "Bác sĩ có 7 năm kinh nghiệm trong lĩnh vực Nhi khoa và Da liễu.",
    },
    create: {
      userId: doctorUser2.id,
      experience: 7,
      bio: "Bác sĩ có 7 năm kinh nghiệm trong lĩnh vực Nhi khoa và Da liễu.",
      rating: 0,
    },
  });

  await prisma.doctorSpecialty.upsert({
    where: {
      doctorId_specialtyId: {
        doctorId: doctor2.id,
        specialtyId: nhiKhoa.id,
      },
    },
    update: {},
    create: {
      doctorId: doctor2.id,
      specialtyId: nhiKhoa.id,
    },
  });

  await prisma.doctorSpecialty.upsert({
    where: {
      doctorId_specialtyId: {
        doctorId: doctor2.id,
        specialtyId: daLieu.id,
      },
    },
    update: {},
    create: {
      doctorId: doctor2.id,
      specialtyId: daLieu.id,
    },
  });

  const doctorUser3 = await prisma.user.upsert({
    where: {
      email: "doctor3@gmail.com",
    },
    update: {
      name: "BS. Lê Minh Tuấn",
      phone: "0900000006",
      gender: "MALE",
      role: "DOCTOR",
    },
    create: {
      name: "BS. Lê Minh Tuấn",
      email: "doctor3@gmail.com",
      password,
      phone: "0900000006",
      gender: "MALE",
      role: "DOCTOR",
    },
  });

  const doctor3 = await prisma.doctor.upsert({
    where: {
      userId: doctorUser3.id,
    },
    update: {
      experience: 12,
      bio: "Bác sĩ có 12 năm kinh nghiệm trong lĩnh vực Thần kinh.",
    },
    create: {
      userId: doctorUser3.id,
      experience: 12,
      bio: "Bác sĩ có 12 năm kinh nghiệm trong lĩnh vực Thần kinh.",
      rating: 0,
    },
  });

  await prisma.doctorSpecialty.upsert({
    where: {
      doctorId_specialtyId: {
        doctorId: doctor3.id,
        specialtyId: thanKinh.id,
      },
    },
    update: {},
    create: {
      doctorId: doctor3.id,
      specialtyId: thanKinh.id,
    },
  });

  const doctorUser4 = await prisma.user.upsert({
    where: {
      email: "doctor4@gmail.com",
    },
    update: {
      name: "BS. Phạm Thu Hà",
      phone: "0900000007",
      gender: "FEMALE",
      role: "DOCTOR",
    },
    create: {
      name: "BS. Phạm Thu Hà",
      email: "doctor4@gmail.com",
      password,
      phone: "0900000007",
      gender: "FEMALE",
      role: "DOCTOR",
    },
  });

  const doctor4 = await prisma.doctor.upsert({
    where: {
      userId: doctorUser4.id,
    },
    update: {
      experience: 9,
      bio: "Bác sĩ có 9 năm kinh nghiệm khám và tư vấn Nội tổng quát.",
    },
    create: {
      userId: doctorUser4.id,
      experience: 9,
      bio: "Bác sĩ có 9 năm kinh nghiệm khám và tư vấn Nội tổng quát.",
      rating: 0,
    },
  });

  await prisma.doctorSpecialty.upsert({
    where: {
      doctorId_specialtyId: {
        doctorId: doctor4.id,
        specialtyId: noiTongQuat.id,
      },
    },
    update: {},
    create: {
      doctorId: doctor4.id,
      specialtyId: noiTongQuat.id,
    },
  });

  const doctorUser5 = await prisma.user.upsert({
    where: {
      email: "doctor5@gmail.com",
    },
    update: {
      name: "BS. Võ Quốc Huy",
      phone: "0900000008",
      gender: "MALE",
      role: "DOCTOR",
    },
    create: {
      name: "BS. Võ Quốc Huy",
      email: "doctor5@gmail.com",
      password,
      phone: "0900000008",
      gender: "MALE",
      role: "DOCTOR",
    },
  });

  const doctor5 = await prisma.doctor.upsert({
    where: {
      userId: doctorUser5.id,
    },
    update: {
      experience: 15,
      bio: "Bác sĩ có 15 năm kinh nghiệm trong lĩnh vực Tim mạch.",
    },
    create: {
      userId: doctorUser5.id,
      experience: 15,
      bio: "Bác sĩ có 15 năm kinh nghiệm trong lĩnh vực Tim mạch.",
      rating: 0,
    },
  });

  await prisma.doctorSpecialty.upsert({
    where: {
      doctorId_specialtyId: {
        doctorId: doctor5.id,
        specialtyId: timMach.id,
      },
    },
    update: {},
    create: {
      doctorId: doctor5.id,
      specialtyId: timMach.id,
    },
  });

  const doctorUser6 = await prisma.user.upsert({
    where: {
      email: "doctor6@gmail.com",
    },
    update: {
      name: "BS. Nguyễn Ngọc Mai",
      phone: "0900000009",
      gender: "FEMALE",
      role: "DOCTOR",
    },
    create: {
      name: "BS. Nguyễn Ngọc Mai",
      email: "doctor6@gmail.com",
      password,
      phone: "0900000009",
      gender: "FEMALE",
      role: "DOCTOR",
    },
  });

  const doctor6 = await prisma.doctor.upsert({
    where: {
      userId: doctorUser6.id,
    },
    update: {
      experience: 8,
      bio: "Bác sĩ có 8 năm kinh nghiệm trong lĩnh vực Nhi khoa.",
    },
    create: {
      userId: doctorUser6.id,
      experience: 8,
      bio: "Bác sĩ có 8 năm kinh nghiệm trong lĩnh vực Nhi khoa.",
      rating: 0,
    },
  });

  await prisma.doctorSpecialty.upsert({
    where: {
      doctorId_specialtyId: {
        doctorId: doctor6.id,
        specialtyId: nhiKhoa.id,
      },
    },
    update: {},
    create: {
      doctorId: doctor6.id,
      specialtyId: nhiKhoa.id,
    },
  });

  const doctorUser7 = await prisma.user.upsert({
    where: {
      email: "doctor7@gmail.com",
    },
    update: {
      name: "BS. Trần Khánh Linh",
      phone: "0900000010",
      gender: "FEMALE",
      role: "DOCTOR",
    },
    create: {
      name: "BS. Trần Khánh Linh",
      email: "doctor7@gmail.com",
      password,
      phone: "0900000010",
      gender: "FEMALE",
      role: "DOCTOR",
    },
  });

  const doctor7 = await prisma.doctor.upsert({
    where: {
      userId: doctorUser7.id,
    },
    update: {
      experience: 6,
      bio: "Bác sĩ có 6 năm kinh nghiệm trong lĩnh vực Da liễu.",
    },
    create: {
      userId: doctorUser7.id,
      experience: 6,
      bio: "Bác sĩ có 6 năm kinh nghiệm trong lĩnh vực Da liễu.",
      rating: 0,
    },
  });

  await prisma.doctorSpecialty.upsert({
    where: {
      doctorId_specialtyId: {
        doctorId: doctor7.id,
        specialtyId: daLieu.id,
      },
    },
    update: {},
    create: {
      doctorId: doctor7.id,
      specialtyId: daLieu.id,
    },
  });

  const doctorUser8 = await prisma.user.upsert({
    where: {
      email: "doctor8@gmail.com",
    },
    update: {
      name: "BS. Đỗ Hoàng Long",
      phone: "0900000011",
      gender: "MALE",
      role: "DOCTOR",
    },
    create: {
      name: "BS. Đỗ Hoàng Long",
      email: "doctor8@gmail.com",
      password,
      phone: "0900000011",
      gender: "MALE",
      role: "DOCTOR",
    },
  });

  const doctor8 = await prisma.doctor.upsert({
    where: {
      userId: doctorUser8.id,
    },
    update: {
      experience: 11,
      bio: "Bác sĩ có 11 năm kinh nghiệm trong lĩnh vực Nội khoa.",
    },
    create: {
      userId: doctorUser8.id,
      experience: 11,
      bio: "Bác sĩ có 11 năm kinh nghiệm trong lĩnh vực Nội khoa.",
      rating: 0,
    },
  });

  await prisma.doctorSpecialty.upsert({
    where: {
      doctorId_specialtyId: {
        doctorId: doctor8.id,
        specialtyId: noiKhoa.id,
      },
    },
    update: {},
    create: {
      doctorId: doctor8.id,
      specialtyId: noiKhoa.id,
    },
  });

  console.log("✅ Seed doctors thành công");

  const doctors = [
    doctor1,
    doctor2,
    doctor3,
    doctor4,
    doctor5,
    doctor6,
    doctor7,
    doctor8,
  ];

  for (const doctor of doctors) {
    await prisma.workingSchedule.deleteMany({
      where: {
        doctorId: doctor.id,
      },
    });

    const schedules = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
      doctorId: doctor.id,
      dayOfWeek,
      startTime: "08:00",
      endTime: "17:00",
      slotDuration: 30,
      isActive: true,
    }));

    await prisma.workingSchedule.createMany({
      data: schedules,
    });
  }

  console.log("✅ Seed working schedules thành công");

  console.log("");
  console.log("========================================");
  console.log("✅ SEED COMPLETED SUCCESSFULLY");
  console.log("========================================");

  console.log("");
  console.log("🔐 Sample password: 123456");

  console.log("");
  console.log("👤 Accounts:");
  console.log("Admin: admin@gmail.com");
  console.log("Receptionist: receptionist@gmail.com");
  console.log("Patient: patient@gmail.com");
  console.log("Doctor 1: doctor1@gmail.com");
  console.log("Doctor 2: doctor2@gmail.com");
  console.log("Doctor 3: doctor3@gmail.com");
  console.log("Doctor 4: doctor4@gmail.com");
  console.log("Doctor 5: doctor5@gmail.com");
  console.log("Doctor 6: doctor6@gmail.com");
  console.log("Doctor 7: doctor7@gmail.com");
  console.log("Doctor 8: doctor8@gmail.com");
  console.log("");
  console.log("🏥 Specialties:");
  console.log([
    noiKhoa.name,
    noiTongQuat.name,
    nhiKhoa.name,
    daLieu.name,
    thanKinh.name,
    timMach.name,
  ]);

  console.log("");
  console.log("👨‍⚕️ Doctors:");
  console.log([
    doctorUser1.name,
    doctorUser2.name,
    doctorUser3.name,
    doctorUser4.name,
    doctorUser5.name,
    doctorUser6.name,
    doctorUser7.name,
    doctorUser8.name,
  ]);
}

main()
  .catch((error) => {
    console.error("❌ Seed error:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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
  console.log("Start seeding...");

  // 1. Hash password mẫu
  const password = await bcrypt.hash("123456", 10);

  // 2. Tạo các chuyên khoa
  const noiKhoa = await prisma.specialty.upsert({
    where: { name: "Nội khoa" },
    update: {},
    create: {
      name: "Nội khoa",
      description: "Khám và điều trị các bệnh lý nội khoa tổng quát",
    },
  });

  const nhiKhoa = await prisma.specialty.upsert({
    where: { name: "Nhi khoa" },
    update: {},
    create: {
      name: "Nhi khoa",
      description: "Khám và điều trị các bệnh lý ở trẻ em",
    },
  });

  const daLieu = await prisma.specialty.upsert({
    where: { name: "Da liễu" },
    update: {},
    create: {
      name: "Da liễu",
      description: "Khám và điều trị các bệnh về da",
    },
  });

  const thanKinh = await prisma.specialty.upsert({
    where: { name: "Thần kinh" },
    update: {},
    create: {
      name: "Thần kinh",
      description: "Khám các bệnh liên quan đến hệ thần kinh",
    },
  });

  const timMach = await prisma.specialty.upsert({
    where: { name: "Tim mạch" },
    update: {},
    create: {
      name: "Tim mạch",
      description: "Khám và điều trị các bệnh tim mạch",
    },
  });

  // 3. Tạo Admin
  await prisma.user.upsert({
    where: {
      email: "admin@gmail.com",
    },
    update: {},
    create: {
      name: "Admin hệ thống",
      email: "admin@gmail.com",
      password,
      phone: "0900000001",
      role: "ADMIN",
    },
  });

  // 4. Tạo Receptionist
  await prisma.user.upsert({
    where: {
      email: "receptionist@gmail.com",
    },
    update: {},
    create: {
      name: "Lễ tân phòng khám",
      email: "receptionist@gmail.com",
      password,
      phone: "0900000002",
      role: "RECEPTIONIST",
    },
  });

  // 5. Tạo Patient
  await prisma.user.upsert({
    where: {
      email: "patient@gmail.com",
    },
    update: {},
    create: {
      name: "Nguyễn Văn Nam",
      email: "patient@gmail.com",
      password,
      phone: "0900000003",
      dateOfBirth: new Date("2000-05-10"),
      role: "PATIENT",
    },
  });

  // 6. Tạo Doctor User 1
  const doctorUser1 = await prisma.user.upsert({
    where: {
      email: "doctor1@gmail.com",
    },
    update: {},
    create: {
      name: "BS. Nguyễn Văn An",
      email: "doctor1@gmail.com",
      password,
      phone: "0900000004",
      role: "DOCTOR",
    },
  });

  // 7. Tạo Doctor Profile 1
  const doctor1 = await prisma.doctor.upsert({
    where: {
      userId: doctorUser1.id,
    },
    update: {},
    create: {
      userId: doctorUser1.id,
      experience: 10,
      bio: "Bác sĩ có 10 năm kinh nghiệm trong lĩnh vực Nội khoa và Tim mạch.",
      rating: 0,
    },
  });

  // 8. Gán chuyên khoa cho bác sĩ 1
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

  // 9. Tạo Doctor User 2
  const doctorUser2 = await prisma.user.upsert({
    where: {
      email: "doctor2@gmail.com",
    },
    update: {},
    create: {
      name: "BS. Trần Thị Bình",
      email: "doctor2@gmail.com",
      password,
      phone: "0900000005",
      role: "DOCTOR",
    },
  });

  // 10. Tạo Doctor Profile 2
  const doctor2 = await prisma.doctor.upsert({
    where: {
      userId: doctorUser2.id,
    },
    update: {},
    create: {
      userId: doctorUser2.id,
      experience: 7,
      bio: "Bác sĩ có 7 năm kinh nghiệm trong lĩnh vực Nhi khoa và Da liễu.",
      rating: 0,
    },
  });

  // 11. Gán chuyên khoa bác sĩ 2
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

  // 12. Tạo lịch làm việc cho bác sĩ 1: Thứ 2 -> Thứ 6
  const doctor1Schedules = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
    doctorId: doctor1.id,
    dayOfWeek,
    startTime: "08:00",
    endTime: "17:00",
    slotDuration: 30,
    isActive: true,
  }));

  // Xóa lịch cũ trước khi seed lại để tránh trùng
  await prisma.workingSchedule.deleteMany({
    where: {
      doctorId: doctor1.id,
    },
  });

  await prisma.workingSchedule.createMany({
    data: doctor1Schedules,
  });

  // 13. Lịch làm việc bác sĩ 2: Thứ 2 -> Thứ 6
  const doctor2Schedules = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
    doctorId: doctor2.id,
    dayOfWeek,
    startTime: "08:00",
    endTime: "16:30",
    slotDuration: 30,
    isActive: true,
  }));

  await prisma.workingSchedule.deleteMany({
    where: {
      doctorId: doctor2.id,
    },
  });

  await prisma.workingSchedule.createMany({
    data: doctor2Schedules,
  });

  console.log("Seed completed successfully!");
  console.log("Sample password: 123456");

  console.log({
    specialties: {
      noiKhoa: noiKhoa.name,
      nhiKhoa: nhiKhoa.name,
      daLieu: daLieu.name,
      thanKinh: thanKinh.name,
      timMach: timMach.name,
    },
    doctors: [doctorUser1.name, doctorUser2.name],
  });
}

main()
  .catch((error) => {
    console.error("Seed error:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
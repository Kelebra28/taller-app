import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL || "admin@taller.com";
const password = process.env.ADMIN_PASSWORD || "Admin123!";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL");
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return console.log("Admin already exists:", email);
  const hash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({ data: { email, passwordHash: hash, role: "ADMIN" } });
  console.log("✅ Admin created:", email, password);
}
main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=>prisma.$disconnect());

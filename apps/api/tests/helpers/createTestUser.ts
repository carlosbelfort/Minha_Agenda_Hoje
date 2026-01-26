import { prisma } from "../../src/lib/prisma";
import { hash } from "bcryptjs";

export async function createTestUser() {
  const passwordHash = await hash("123456", 8);

  await prisma.user.upsert({
    where: {
      email: "admin@email.com",
    },
    update: {},
    create: {
      name: "Admin Teste",
      email: "admin@email.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });
}
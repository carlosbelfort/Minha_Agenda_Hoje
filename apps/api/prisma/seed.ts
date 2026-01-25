import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }[] = [
    {
      name: "Administrador",
      email: "admin@teste.com",
      password: "123456",
      role: Role.ADMIN,
    },
    {
      name: "João Silva",
      email: "joao@teste.com",
      password: "123456",
      role: Role.USER,
    },
    {
      name: "Maria Souza",
      email: "maria@teste.com",
      password: "123456",
      role: Role.USER,
    },
  ];

  for (const user of users) {
    const exists = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (exists) {
      console.log(`⚠️ ${user.email} já existe`);
      continue;
    }

    const passwordHash = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: passwordHash,
        role: user.role,
      },
    });

    console.log(`✅ ${user.email} criado`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

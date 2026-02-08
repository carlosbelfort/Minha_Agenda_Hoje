import { prisma } from "../src/lib/prisma";

async function main() {
  const usersCount = await prisma.user.count();

  if (usersCount > 0) {
    console.log("Banco já populado. Seed ignorado.");
    return;
  }

  console.log("Banco vazio. Executando seed...");
  await import("../prisma/seed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
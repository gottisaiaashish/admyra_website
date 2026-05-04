import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  console.log(`\n--- DATABASE STATS ---`);
  console.log(`Total Users: ${count}`);
  
  const users = await prisma.user.findMany({
    select: { email: true, name: true, createdAt: true }
  });
  
  console.log(`\n--- USER LIST ---`);
  users.forEach((u, i) => {
    console.log(`${i + 1}. ${u.name} (${u.email}) - Joined: ${u.createdAt}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

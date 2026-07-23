const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('DATABASE_URL is:', process.env.DATABASE_URL);
  console.log('Connecting to database...');
  await prisma.$connect();
  console.log('Connected successfully!');
  const count = await prisma.user.count();
  console.log('User count:', count);
}

main().catch(console.error).finally(() => prisma.$disconnect());

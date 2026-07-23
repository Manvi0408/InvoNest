const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspect() {
  const user = await prisma.user.findFirst({
    include: {
      memberships: {
        include: {
          organization: true
        }
      }
    }
  });
  console.log('User:', JSON.stringify(user, null, 2));

  const orgs = await prisma.organization.findMany();
  console.log('Orgs:', JSON.stringify(orgs, null, 2));

  const invoices = await prisma.invoice.findMany();
  console.log('Invoices Count:', invoices.length);
}

inspect()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const clients = await prisma.client.findMany();
  console.log('Clients:', clients.map(c => ({ id: c.id, name: c.name })));

  const invoices = await prisma.invoice.findMany();
  console.log('Invoices:', invoices.map(i => ({ id: i.id, num: i.invoiceNumber })));

  const reminders = await prisma.reminder.findMany();
  console.log('Reminders:', reminders.map(r => ({ id: r.id })));
}

main().catch(console.error).finally(() => prisma.$disconnect());

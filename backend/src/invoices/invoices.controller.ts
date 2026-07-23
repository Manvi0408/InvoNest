import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoiceStatus, PaymentMethod } from '@prisma/client';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(
    @Body() body: {
      orgId: string;
      clientId: string;
      invoiceNumber: string;
      amount: number;
      currency?: string;
      dueDate: string;
      items: Array<{ description: string; quantity: number; unitPrice: number }>;
    },
  ) {
    return this.invoicesService.createInvoice(body.orgId, {
      ...body,
      dueDate: new Date(body.dueDate),
    });
  }

  @Get('org/:orgId')
  async getAll(@Param('orgId') orgId: string) {
    return this.invoicesService.getInvoices(orgId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.invoicesService.getInvoice(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: InvoiceStatus,
  ) {
    return this.invoicesService.updateStatus(id, status);
  }

  @Post(':id/comments')
  async comment(
    @Param('id') id: string,
    @Body() body: { userId: string; userName: string; text: string },
  ) {
    return this.invoicesService.addComment(id, body.userId, body.userName, body.text);
  }

  @Post(':id/payments')
  async pay(
    @Param('id') id: string,
    @Body() body: { amount: number; method: PaymentMethod; transactionId?: string },
  ) {
    return this.invoicesService.recordPayment(id, body.amount, body.method, body.transactionId);
  }
}

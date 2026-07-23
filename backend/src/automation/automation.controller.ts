import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { ReminderChannel } from '@prisma/client';

@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post('workflow/:orgId')
  async createWorkflow(
    @Param('orgId') orgId: string,
    @Body('steps') steps: any[],
  ) {
    return this.automationService.createReminderWorkflow(orgId, steps);
  }

  @Get('workflow/:orgId')
  async getWorkflows(@Param('orgId') orgId: string) {
    return this.automationService.getReminderWorkflows(orgId);
  }

  @Post('reminder')
  async createReminder(
    @Body() body: { invoiceId: string; channel: ReminderChannel; delayDays: number },
  ) {
    return this.automationService.createReminder(body.invoiceId, body.channel, body.delayDays);
  }

  @Post('reminder/:id/execute')
  async executeReminder(@Param('id') id: string) {
    return this.automationService.triggerReminderExecution(id);
  }
}

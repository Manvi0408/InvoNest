import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AiCopilotService } from './ai-copilot.service';

@Controller('ai-copilot')
export class AiCopilotController {
  constructor(private readonly copilotService: AiCopilotService) {}

  @Post('ask')
  async ask(
    @Body() body: { orgId: string; userId: string; query: string },
  ) {
    return this.copilotService.askCopilot(body.orgId, body.userId, body.query);
  }

  @Get('narrative/:orgId')
  async getNarrative(@Param('orgId') orgId: string) {
    return this.copilotService.getFinancialNarrative(orgId);
  }

  @Get('actions/:orgId')
  async getActions(@Param('orgId') orgId: string) {
    return this.copilotService.getTodaysActions(orgId);
  }
}

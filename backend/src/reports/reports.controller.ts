import { Controller, Get, Post, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('aging/:orgId')
  async getAging(@Param('orgId') orgId: string) {
    return this.reportsService.generateAgingReport(orgId);
  }

  @Post('executive/:orgId')
  async generateExecutive(@Param('orgId') orgId: string) {
    return this.reportsService.generateExecutiveWeeklySummary(orgId);
  }
}

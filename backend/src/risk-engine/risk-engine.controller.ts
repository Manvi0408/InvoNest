import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { RiskEngineService } from './risk-engine.service';

@Controller('risk-engine')
export class RiskEngineController {
  constructor(private readonly riskEngineService: RiskEngineService) {}

  @Post('client/:clientId/health')
  async assessClient(@Param('clientId') clientId: string) {
    return this.riskEngineService.calculateClientHealthScore(clientId);
  }

  @Post('invoice/:invoiceId/predict')
  async predictInvoice(@Param('invoiceId') invoiceId: string) {
    return this.riskEngineService.predictInvoiceRisk(invoiceId);
  }

  @Get('org/:orgId/heatmap')
  async getHeatmap(@Param('orgId') orgId: string) {
    return this.riskEngineService.getRevenueRiskHeatmap(orgId);
  }
}

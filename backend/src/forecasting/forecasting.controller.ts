import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ForecastingService } from './forecasting.service';

@Controller('forecasting')
export class ForecastingController {
  constructor(private readonly forecastingService: ForecastingService) {}

  @Get('org/:orgId')
  async getForecast(
    @Param('orgId') orgId: string,
    @Query('rangeDays') rangeDays?: string,
  ) {
    const days = rangeDays ? parseInt(rangeDays, 10) : 30;
    return this.forecastingService.getForecast(orgId, days);
  }

  @Post('org/:orgId/simulate')
  async simulateScenario(
    @Param('orgId') orgId: string,
    @Body() body: {
      scenario: string;
      clientName?: string;
      percentageChange?: number;
      valueAmount?: number;
    },
  ) {
    return this.forecastingService.runScenarioSimulation(
      orgId,
      body.scenario,
      body.clientName,
      body.percentageChange,
      body.valueAmount,
    );
  }
}

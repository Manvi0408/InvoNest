import { Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { RiskEngineModule } from '../risk-engine/risk-engine.module';
import { ForecastingModule } from '../forecasting/forecasting.module';

@Global()
@Module({
  imports: [RiskEngineModule, ForecastingModule],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}

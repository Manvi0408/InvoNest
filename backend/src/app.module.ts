import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';
import { OcrModule } from './ocr/ocr.module';
import { ForecastingModule } from './forecasting/forecasting.module';
import { RiskEngineModule } from './risk-engine/risk-engine.module';
import { AutomationModule } from './automation/automation.module';
import { AiCopilotModule } from './ai-copilot/ai-copilot.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    ClientsModule,
    InvoicesModule,
    OcrModule,
    ForecastingModule,
    RiskEngineModule,
    AutomationModule,
    AiCopilotModule,
    NotificationsModule,
    ReportsModule,
    QueueModule,
  ],
})
export class AppModule {}

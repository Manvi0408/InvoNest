import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async createClient(orgId: string, data: {
    name: string;
    email: string;
    phone?: string;
    companyName?: string;
  }) {
    const client = await this.prisma.client.create({
      data: {
        organizationId: orgId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        outstandingBalance: 0.0,
      },
    });

    // Automatically seed an empty risk assessment profile
    await this.prisma.clientRiskProfile.create({
      data: {
        clientId: client.id,
        riskScore: 25,
        riskLevel: 'LOW',
        outstandingDebt: 0.0,
        averageDelayDays: 0,
        paymentReliability: 100,
        revenueContribution: 10,
        creditworthinessLimit: 150000.0,
        creditScoreConfidence: 0.9,
      },
    });

    return client;
  }

  async getClients(orgId: string) {
    return this.prisma.client.findMany({
      where: { organizationId: orgId },
      include: { riskProfile: true },
      orderBy: { name: 'asc' },
    });
  }

  async getClient(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { riskProfile: true, invoices: true },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }
}

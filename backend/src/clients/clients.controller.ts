import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post(':orgId')
  async create(
    @Param('orgId') orgId: string,
    @Body() body: { name: string; email: string; phone?: string; companyName?: string },
  ) {
    return this.clientsService.createClient(orgId, body);
  }

  @Get('org/:orgId')
  async getAll(@Param('orgId') orgId: string) {
    return this.clientsService.getClients(orgId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.clientsService.getClient(id);
  }
}

import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Post()
  async create(@Body() body: { name: string; slug: string }) {
    return this.orgsService.createOrg(body.name, body.slug);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.orgsService.getOrg(id);
  }

  @Get()
  async list() {
    return this.orgsService.listOrgs();
  }
}

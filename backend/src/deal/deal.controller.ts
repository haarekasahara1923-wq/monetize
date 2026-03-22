import { Controller, Post, Patch, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { DealService } from './deal.service';
import { CreateDealDto, UpdateDealStatusDto } from './dto/deal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('deals')
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS)
  @Post()
  async create(@Request() req, @Body() dto: CreateDealDto) {
    return this.dealService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS)
  @Post(':id/generate-contract')
  async generateContract(@Param('id') id: string, @Request() req) {
    return this.dealService.generateAiContract(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Request() req, @Body() dto: UpdateDealStatusDto) {
    return this.dealService.updateStatus(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findMyDeals(@Request() req) {
    return this.dealService.findByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.dealService.findOne(id);
  }
}

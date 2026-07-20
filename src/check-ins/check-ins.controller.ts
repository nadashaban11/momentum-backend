import { Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { CheckInsService } from './check-ins.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class CheckInsController {
  constructor(private readonly checkInService: CheckInsService) { }

  @Post('participations/:id/check-ins')
  async createCheckIn(@Param('id', ParseUUIDPipe) participationId: string) {
    return await this.checkInService.createCheck(participationId);
  }

  @Get('participations/:id/check-ins')
  async getCheckInHistory(
    @Param('id', ParseUUIDPipe) participationId: string) {
    return await this.checkInService.getCheckInHistory(participationId);
  }
}

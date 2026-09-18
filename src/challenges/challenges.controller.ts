import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dtos';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { ParticipationsService } from 'src/participations/participations.service';

@Controller('challenges')
export class ChallengesController {
  constructor(
    private readonly challengesService: ChallengesService,
    private readonly participationsService: ParticipationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() dto: CreateChallengeDto) {
    return await this.challengesService.create(req.user.id, dto);
  }

  @Get()
  async findAll() {
    return await this.challengesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyChallenges(@Req() req: any) {
    const userId = req.user.id;
    return await this.participationsService.getUserChallenges(userId);
  }

  // Static routes before ':id' params — avoids shadowing.
  @UseGuards(JwtAuthGuard)
  @Post('join-by-code/:code')
  async joinByCode(@Req() req: any, @Param('code') code: string) {
    return await this.challengesService.joinByInviteCode(req.user.id, code);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return await this.challengesService.findById(id, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return await this.challengesService.joinChallenge(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/leave')
  async leave(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    await this.challengesService.leaveChallenge(req.user.id, id);
    return { message: 'Successfully left the challenge' };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/invite')
  async generateInvite(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return await this.challengesService.generateInviteCode(req.user.id, id);
  }
}

import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CheckInsService } from './check-ins.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller()
export class CheckInsController {
    constructor(private readonly checkInService: CheckInsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('participations/:id/check-ins')
    async createCheckIn(@Param('id') participationId: string){
        return await this.checkInService.createCheck(participationId);
    }
}

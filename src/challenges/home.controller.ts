import { Controller, Get } from '@nestjs/common';
import { ChallengesService } from './challenges.service';

@Controller('home')
export class HomeController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  async getHomeFeed() {
    return await this.challengesService.getHomeFeed();
  }
}

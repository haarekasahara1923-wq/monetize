import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('influencers')
  async findInfluencers(@Query('platform') platform: string, @Query('minFollowers') minFollowers: string, @Query('city') city: string) {
    return this.userService.findInfluencers({
      platform,
      minFollowers: minFollowers ? parseInt(minFollowers) : undefined,
      city,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}

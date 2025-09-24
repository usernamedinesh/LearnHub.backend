import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { allUser } from 'src/database';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  @Get()
  async checkHealth() {
    const user = await allUser;
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now(),
      user,
    };
  }
}

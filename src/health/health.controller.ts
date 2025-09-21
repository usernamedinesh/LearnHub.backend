import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { db } from 'src/config/db';
import { users } from 'src/schema';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  @Get()
  async checkHealth() {
    const user = db.select().from(users);
    console.log('USER', user);
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now(),
      // user,
    };
  }
}

import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { HealthModule } from 'src/health/health.module';
import { loggerConfig } from 'src/config/logger.config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig],
    }),

    HealthModule,
    LoggerModule.forRootAsync(loggerConfig),
  ],
})
export class AppModule {}

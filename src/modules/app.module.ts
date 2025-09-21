import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { HealthModule } from 'src/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig],
    }),
    HealthModule,
  ],
})
export class AppModule {}

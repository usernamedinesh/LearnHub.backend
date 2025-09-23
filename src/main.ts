import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as PinoLogger, LoggerErrorInterceptor } from 'nestjs-pino';
import { corsConfig } from './config/cors.config';
import { setupShutdownHooks } from './config/shutdown.config';
import { env } from './config/env.config';
import { testDbConnection } from './config/db';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // required for async logger setup
  });
  const logger = app.get(PinoLogger);
  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors(corsConfig());

  setupShutdownHooks(app);

  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  //global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('CourseHub')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  testDbConnection();
  await app.listen(env.PORT);

  logger.log(
    `🚀 Server is running at http://localhost:${env.PORT}/api`,
    'bootstrap',
  );
}

bootstrap();

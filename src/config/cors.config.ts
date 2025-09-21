import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig = (): CorsOptions => ({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
});

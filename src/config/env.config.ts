import dotenv from 'dotenv';
dotenv.config();
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),

  PORT: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive().finite().default(8001),
  ),

  DATABASE_URL: z.string().url().optional(),

  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
});

// 🔸 Define the TypeScript type from the schema
export type EnvVars = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables. Check your .env file.');
}

export const env: EnvVars = parsedEnv.data;

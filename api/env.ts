import { z } from 'zod';
import dotenv from 'dotenv';


dotenv.config();

const clientEnvSchema = z.object({
  NODE_ENV: z
    .enum(["production", "test", "development"])
    .default("production"),
  SESSION_DURATION: z
    .number()
    .default(60 * 60 * 24 * 30)
    .refine(
      (duration: number) => duration > 60 * 60 && duration < 60 * 60 * 24 * 366,
      "Session duration should be less than a leap year, greater than an hour"
    )
});

const envSchema = z.object({
  PORT: z
    .number()
    .default(3000)
    .refine(
      (port: number) => port > 0 && port < 65536,
      "Invalid port number"
    ),
  NODE_ENV: z
    .enum(["production", "test", "development"])
    .default("production"),
  SESSION_SECRET: z
    .string()
    .default("change-me"),
  SESSION_DURATION: z
    .number()
    .default(60 * 60 * 24 * 30)
    .refine(
      (duration: number) => duration > 60 * 60 && duration < 60 * 60 * 24 * 366,
      "Session duration should be less than a leap year, greater than an hour"
    ),
  DATABASE_URL: z
    .string()
});

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
export const CLIENT_ENV = clientEnvSchema.parse(process.env)

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const connectionSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URI,
  // Local Docker has no SSL, Supabase/prod needs it
  ssl:
    process.env.DB_URI?.includes('localhost') ||
    process.env.DB_URI?.includes('127.0.0.1')
      ? false
      : { rejectUnauthorized: false },
  synchronize: false,
  logging: true,
  entities: ['src/**/*.entity{.ts,.js}', 'dist/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}', 'dist/migrations/*{.ts,.js}'],
});
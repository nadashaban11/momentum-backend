import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const connectionSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URI,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  logging: true,
  entities: ['src/**/*.entity{.ts,.js}', 'dist/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}', 'dist/migrations/*{.ts,.js}'],
});
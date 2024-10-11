import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Cars from '../modules/cars/entities/Cars';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Cars],
  migrations: ['src/db/migrations/*.ts'],
  subscribers: [],
});

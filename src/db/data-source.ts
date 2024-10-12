import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Cars from '../modules/cars/entities/Cars';

import dotenv from 'dotenv';
dotenv.config();

const port = process.env.DB_PORT as number | undefined;

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  // logging: true,
  entities: [Cars],
  migrations: ['src/db/migration/*.ts'],
  subscribers: [],
});

export default AppDataSource;

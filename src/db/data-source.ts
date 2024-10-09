import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';

const port = process.env.DB_PORT as number | undefined;

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;

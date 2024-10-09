import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { CreateCustomersTable1728515426452 } from './migrations/1728515426452-CreateCustomersTable';
import Customer from '../modules/customers/entities/Customer';

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
  entities: [Customer],
  migrations: [CreateCustomersTable1728515426452],
  subscribers: [],
});

export default AppDataSource;

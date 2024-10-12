import 'reflect-metadata';
<<<<<<< HEAD
import { DataSource } from 'typeorm';
=======

import { DataSource } from 'typeorm';
import Customer from '../modules/customers/entities/Customer';
import User from '../modules/users/entities/User'
import RentalRequest from '../modules/rental_requests/entities/rental_request';
>>>>>>> f1e142729cbb38a0d38a10cb7ddf1c8c10b9518d
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
<<<<<<< HEAD
  entities: [Cars],
=======
  entities: [Customer, User, RentalRequest, Cars],
>>>>>>> f1e142729cbb38a0d38a10cb7ddf1c8c10b9518d
  migrations: ['src/db/migration/*.ts'],
  subscribers: [],
});

export default AppDataSource;

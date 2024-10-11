import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import AppDataSource from './db/data-source';
import 'dotenv/config';
//import customerRouter from './modules/customers/routes/CustomerRoute';
import RentalRequest from './modules/rental_requests/entities/rental_request';
const app = express();

app.use(cors());

app.use(express.json());

app.use();

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to the database');

    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });

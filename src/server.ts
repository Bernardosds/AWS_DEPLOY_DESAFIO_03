import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import AppDataSource from './db/data-source';
import 'dotenv/config';
import customerRouter from './modules/customers/routes/CustomerRoute';

const app = express();

app.use(cors());

app.use(express.json());

app.use(customerRouter);

AppDataSource.initialize().then(async () => {
  console.log('Conectou ao banco :)');
  app.listen(process.env.PORT, () => {
    console.log('Server started');
  });
});

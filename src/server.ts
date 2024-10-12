import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import AppDataSource from './db/data-source';
import routes from './modules/cars/routes/routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

AppDataSource.initialize().then(async () => {
  console.log('Conectou ao banco :)');
  app.listen(3333, () => {
    console.log('Server started');
  });
});

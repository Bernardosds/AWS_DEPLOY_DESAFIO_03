import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from './db/data-source';
import routes from './modules/cars/routes/routes';
import AppError from './shared/errors/AppError';
import { errorMiddleware } from './shared/middlewares/errorMiddleware';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use(errorMiddleware);

/*app.use((error: Error, request: Request, res: Response): void => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ status: 'error', message: error.message });
  }
  res.status(500).json({
    status: 'error',
    message: 'internal server error',
  });
});
*/
AppDataSource.initialize().then(async () => {
  console.log('Conectou ao banco :)');
  app.listen(3333, () => {
    console.log('Server started');
  });
});

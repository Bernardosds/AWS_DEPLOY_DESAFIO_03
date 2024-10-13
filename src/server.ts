import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { AppDataSource } from './db/DataSource';
import userRouter from './modules/users/routes/UsersRoutes';
import { errors } from 'celebrate';
import AppError from './shared/errors/AppError';
import loginRouter from './modules/users/routes/LoginRoutes';
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from './shared/middlewares/verifyauth';

const app = express();

app.use(cors());

app.use(express.json());

app.use(authMiddleware);

app.use('/users', userRouter);
app.use('/login', loginRouter);

app.use(errors());

app.use(
  (error: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });

    return next(error);
  },
);

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

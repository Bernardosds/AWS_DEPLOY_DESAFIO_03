import { Router } from 'express';
import UsersRepository from '../repositories/UsersRepository';
import HashProvider from '../providers/BcryptHashProvider';
import CreateUserService from '../services/CreateUserService';
import UsersController from '../controllers/UsersController';
import User from '../entities/User';
import { celebrate, Joi, Segments } from 'celebrate';
import { AppDataSource } from '../../../db/DataSource';
import ListUsersService from '../services/ListUsersService';

const userRouter = Router();

// userRouter.use(authmiddlewarehere);

const userRepository = AppDataSource.getRepository(User);
const usersRepository = new UsersRepository(userRepository);

const hashProvider = new HashProvider();

const createUserService = new CreateUserService(usersRepository, hashProvider);
const listUsersService = new ListUsersService(usersRepository);

const usersController = new UsersController(
  createUserService,
  listUsersService,
);

userRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      filters: Joi.string().optional(),
      sort: Joi.object({
        field: Joi.string().valid('name', 'email', 'createdAt').optional(),
        order: Joi.string().valid('ASC', 'DESC').optional(),
      }),
      pagination: Joi.object({
        page: Joi.number().integer().min(1).optional(),
        size: Joi.number().integer().min(1).optional(),
      }),
    },
  }),
  (req, res) => usersController.findAll(req, res)
);

userRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    },
  }),
  (req, res) => usersController.create(req, res),
);
// userRouter.get('id', controller);
// userRouter.put('id', controller);
// userRouter.delete('id', controller);

export default userRouter;

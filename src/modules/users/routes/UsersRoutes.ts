import { Router } from 'express';
import UsersRepository from '../repositories/UsersRepository';
import HashProvider from '../providers/BcryptHashProvider'
import CreateUserService from '../services/CreateUserService';
import UsersController from '../controllers/UsersController';
import User from '../entities/User';
import { celebrate, Joi, Segments } from 'celebrate';
import { AppDataSource } from '../../../db/DataSource';


const userRouter = Router();

// userRouter.use(authmiddlewarehere);

const userRepository = AppDataSource.getRepository(User);
const usersRepository = new UsersRepository(userRepository);
const hashProvider = new HashProvider();
const createUserService = new CreateUserService(usersRepository, hashProvider);
const usersController = new UsersController(createUserService);

// userRouter.get('/', controller);
userRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    },
  }),
  (req, res) => usersController.create(req, res)
 );
// userRouter.get('id', controller);
// userRouter.put('id', controller);
// userRouter.delete('id', controller);

export default userRouter;

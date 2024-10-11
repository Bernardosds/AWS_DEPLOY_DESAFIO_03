import { Router } from 'express';

// import UsersRepository from '../repositories/UsersRepository';
// import HashProvider from '../providers/BcryptHashProvider'
// import CreateUserService from '../services/CreateUserService';
// import UsersController from '../controllers/UsersController';

import RentalRequest from '../entities/rental_request';

import { celebrate, Joi, Segments } from 'celebrate';

import AppDataSource from '../../../db/data-source'; 

import { RentalRequestController } from '../controllers/rental_requests.controller';

const rentalRouter = Router();
const rentalRouterController = new RentalRequestController
// userRouter.use(authmiddlewarehere);

//const requestRepository= AppDataSource.getRepository(RentalRequest);
//const usersRepository = new UsersRepository(userRepository);
//const hashProvider = new HashProvider();
//const createUserService = new CreateUserService(usersRepository, hashProvider);
//const usersController = new UsersController(createUserService);

// userRouter.get('/', controller);
rentalRouter.post('/criar', rentalRouterController.create.bind(rentalRouterController));
rentalRouter.get('/', rentalRouterController.show.bind(rentalRouterController));
// userRouter.get('id', controller);
// userRouter.put('id', controller);
// userRouter.delete('id', controller);

export default rentalRouter;

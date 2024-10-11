import { Router } from 'express'; 
//import { RentalRequestController } from '../controllers/rental_requests.controller';
//import RentalRequest from '../entities/rental_request'
//import AppDataSource from '../../../db/data-source'
import { login } from '../../../config/auth';
const loginRouter = Router();

//const requestRepository = AppDataSource.getRepository(RentalRequest);
//const rentalRouterController = new RentalRequestController();

//rentalRouter.post('/criar', rentalRouterController.create.bind(rentalRouterController));
loginRouter.get('/login', login);
//rentalRouter.get('/:id', rentalRouterController.showById.bind(rentalRouterController));
// userRouter.put('/:id', controller);
// userRouter.delete('/:id', controller);

export default loginRouter;
import { Router } from 'express'; 
import { RentalRequestController } from '../controllers/rental_requests.controller';
//import RentalRequest from '../entities/rental_request'
//import AppDataSource from '../../../db/data-source'
import { authMiddleware } from '../../../shared/middlewares/verifyauth';
const rentalRouter = Router();

//const requestRepository = AppDataSource.getRepository(RentalRequest);

const rentalRouterController = new RentalRequestController();


rentalRouter.post('/criar',authMiddleware, rentalRouterController.create.bind(rentalRouterController));
rentalRouter.get('/', rentalRouterController.show.bind(rentalRouterController));
rentalRouter.get('/:id', rentalRouterController.showById.bind(rentalRouterController));

// userRouter.put('/:id', controller);
// userRouter.delete('/:id', controller);

export default rentalRouter;

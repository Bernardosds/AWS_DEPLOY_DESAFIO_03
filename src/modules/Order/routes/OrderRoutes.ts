import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

const orderRouter = Router();

const orderController = new OrderController

orderRouter.post('/create',orderController.create.bind(orderController));
orderRouter.patch('/update/:id', orderController.update.bind(orderController))
orderRouter.get('/', orderController.show.bind(orderController))

export default orderRouter;
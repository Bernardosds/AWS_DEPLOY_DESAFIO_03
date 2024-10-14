import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

const orderRouter = Router();
const orderController = new OrderController();


orderRouter.post('/create', orderController.create.bind(orderController));
orderRouter.get('/:id', orderController.showById.bind(orderController));
orderRouter.get('/', orderController.show.bind(orderController));
orderRouter.put('/update/:id', orderController.update.bind(orderController));
orderRouter.delete('/delete/:id', orderController.cancelOrder.bind(orderController));

export default orderRouter;
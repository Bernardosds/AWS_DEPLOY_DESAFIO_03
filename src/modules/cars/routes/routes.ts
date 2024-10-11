import { Router } from 'express';
import { CarsController } from '../controllers/CarsController';

const routes = Router();
const carsController = new CarsController();

routes.post('/cars', carsController.create);
routes.get('/cars', carsController.list);
routes.get('/cars/:id', carsController.getById.bind(carsController));
routes.patch('/cars/:id', carsController.updateCar);
routes.delete('/cars/:id', carsController.deleteCar);

export default routes;

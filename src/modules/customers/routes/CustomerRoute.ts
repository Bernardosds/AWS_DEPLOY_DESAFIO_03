import { Router } from 'express';
import CustomerController from '../controllers/customers.controllers';
import CustomerServices from '../services/CustomerServices';

const customerRouter = Router();
const customerController = new CustomerController();
const customerServices = new CustomerServices();

customerRouter.post(
  '/customers',
  customerServices.validateCustomer,
  customerController.create,
);

customerRouter.get('/customers/:id', customerController.read);

customerRouter.patch(
  '/customers/:id',
  customerServices.validateCustomerUpdate,
  customerController.update,
);

customerRouter.delete('/customers/:id', customerController.delete);

export default customerRouter;

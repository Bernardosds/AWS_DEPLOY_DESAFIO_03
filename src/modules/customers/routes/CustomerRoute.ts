import { Router } from 'express';
import CustomerController from '../controllers/customers.controllers';
import CreateCustomerService from '../services/CreateCustomerService';
import UpdateCustomerService from '../services/UpdateCustomerService';
import DeleteCustomerService from '../services/DeleteCustomerService';

const customerRouter = Router();
const customerController = new CustomerController();
const createCustomersService = new CreateCustomerService();
const updateCustomersService = new UpdateCustomerService();
const deleteCustomersService = new DeleteCustomerService();

customerRouter.post(
  '/customers',
  createCustomersService.validateCustomer,
  customerController.create,
);

customerRouter.get('/customers/:id', customerController.readById);

customerRouter.get('/customers', customerController.read);

customerRouter.patch(
  '/customers/:id',
  updateCustomersService.validateCustomerUpdate,
  customerController.update,
);

customerRouter.delete(
  '/customers/:id',
  deleteCustomersService.validateCustomerDelete,
  customerController.delete,
);

export default customerRouter;

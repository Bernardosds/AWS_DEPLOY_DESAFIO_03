import { Request, Response } from 'express';
import ICustomer from '../interfaces/ICustomer';
import CustomerRepository from '../repositories/CustomerRepository';

const customerRepository = new CustomerRepository();

class CustomerController {
  create = async (req: Request, res: Response): Promise<void> => {
    const customer: ICustomer = req.body;

    try {
      const newCustomer = await customerRepository.createCustomer(customer);
      res.status(201).json({ newCustomer });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
      return;
    }
  };
}

export default CustomerController;

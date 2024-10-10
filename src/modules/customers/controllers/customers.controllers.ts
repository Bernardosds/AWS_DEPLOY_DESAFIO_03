import { Request, Response } from 'express';
import ICustomer from '../interfaces/ICustomer';
import { customerRepositorySource } from '../repositories/CustomerRepository';

class CustomerController {
  async create(req: Request, res: Response): Promise<void> {
    const customer: ICustomer = req.body;

    try {
      const newCustomer = customerRepositorySource.create(customer);
      await customerRepositorySource.save(newCustomer);
      res.status(201).json({ newCustomer });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
      return;
    }
  }
}
export default CustomerController;

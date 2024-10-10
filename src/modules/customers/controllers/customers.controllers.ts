import { Request, Response } from 'express';
import ICustomer from '../interfaces/ICustomer';
import { validate as isUuid } from 'uuid';
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

  async read(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const customer = await customerRepositorySource.findOneBy({ id });

      if (!id || !isUuid(id)) {
        res.status(400).json({ message: 'Valid ID is required' });
        return;
      }

      if (!customer) {
        res.status(404).json({ message: 'Customer not found' });
        return;
      }
      res.status(200).json({ customer });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
      return;
    }
  }
}
export default CustomerController;

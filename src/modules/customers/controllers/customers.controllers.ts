import { Request, Response } from 'express';
import ICustomer from '../interface/ICustomer';
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

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const customer = await customerRepositorySource.findOne({
      where: { id },
      withDeleted: true,
    });
    await customerRepositorySource.softDelete({ id });

    if (!id || !isUuid(id)) {
      res.status(400).json({ message: 'Valid ID is required' });
      return;
    }

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    if (customer.deletedAt) {
      res.status(400).json({ message: 'Customer already deleted' });
      return;
    }

    res.status(200).json({ message: 'Customer deleted' });
    return;
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const customerData: ICustomer = req.body;

    try {
      const existsCustomer = await customerRepositorySource.findOne({
        where: { id },
      });
      if (!existsCustomer) {
        res.status(404).json({ message: 'Customer not found' });
        return;
      }
      await customerRepositorySource.update({ id }, customerData);
      res.status(200).json({ message: 'Customer updated' });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
}
export default CustomerController;

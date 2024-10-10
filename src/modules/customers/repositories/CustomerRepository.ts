import Customer from '../entities/Customer';
import ICustomer from '../interfaces/ICustomer';
import AppDataSource from '../../../db/data-source';

const customerRepository = AppDataSource.getRepository(Customer);

class CustomerRepository {
  createCustomer = async (dataCustomer: ICustomer): Promise<ICustomer> => {
    const newCustomer = customerRepository.create(dataCustomer);
    const saveCustomer = await customerRepository.save(newCustomer);
    return saveCustomer;
  };

  async findCustomerByCpf(cpf: string): Promise<ICustomer | null> {
    return await customerRepository.findOne({ where: { cpf } });
  }

  async findCustomerByEmail(email: string): Promise<ICustomer | null> {
    return await customerRepository.findOne({ where: { email } });
  }
}

export default CustomerRepository;

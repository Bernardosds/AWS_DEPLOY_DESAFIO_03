//import Error from '../../../shared/errors/Errors';
//import RentalRequest from '../entities/rental_request';
import IResquestRepository from '../interfaces/IRentalRequestRepository';
import IRentalRequestCreate from '../interfaces/ICreateRentalRequest';
import ICreteOrders from '../interfaces/IRRCreate';
import { isValidCpf } from './validCPF';



export default class CreateOrder implements IRentalRequestCreate{
    private orderRepository: IResquestRepository;

  
    constructor(orderRepository: IResquestRepository) {
      this.orderRepository = orderRepository;
      
    }
  
    public async execute({cpf_cliente, car_model }: ICreteOrders): Promise<string> {
       
        if (!isValidCpf(cpf_cliente)) {
            throw new Error( 'CPF inválido');
          }
          if (!isValidCpf(car_model)) {
            throw new Error( 'statusRequest inválido');
          }
            if (!car_model) {
             throw new Error('cep is required', 400);
                }
        
         const orderId = await this.orderRepository.create({
               

        
            });
  
      if (!orderId) {
        throw new Error('failed to create user', 500);
      }
  
      return userId;
    }
  }
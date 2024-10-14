import AppError from '../../../shared/errors/AppError';
import IUser from '../models/IUser';
import IUsersRepository from '../models/IUsersRepository';
import IHashProvider from '../models/IHashProvider';
import ICreateUserService from '../models/ICreateUserServices';import AppError from '../../../shared/errors/AppError';
import ICre
import IOrderRepository from '../interfaces/IOrderRepository';
import { formatPlate } from "../../cars/services/formatters";
import ICreateOrderService from "../interfaces/ICreateOrderService";

export default class CreateOrder implements ICreateOrderService {
    private ordersRepository: Repository<Order>;
    private customerRepository: Repository<Customer>;
    private carsRepository: Repository<Cars>;
    
    
    constructor(ordersRepository: IOrderRepository) {
        this.ordersRepository = ordersRepository;
        this.customerRepository = customerRepository;
        this.carsRepository = carsRepository;
    }
    public async execute({customer_cpf, car_plate}: IOrder): Promise<string> {
        if(!customer_cpf) {
            throw new Error("Type a valid client cpf")
        }
        if(!car_plate) {
            throw new Error
        }
        const checkRequest = await this.ordersRepository.find({
            relations: {
                customer: true
            },
            where: {
                customer: {
                    cpf: customer_cpf
                }

            }),
        if(checkRequest.length > 0) {
            throw new Error("This client already has a request pendent ")
        }

        const createOrder = this.ordersRepository.create({
            customer: cpf_cliente, 
            car: car_plate,
        })

        return createOrder

    }
}



        






import AppDataSource from '../../../db/data-source'; 
import {Request, Response} from 'express'
import RentalRequest from '../entities/rental_request';
import Customer from '../../customers/entities/Customer';
import Cars from '../../cars/entities/Cars';

export class RentalRequestController {
    private requestRepository = AppDataSource.getRepository(RentalRequest)
    private customerRespostiroy = AppDataSource.getRepository(Customer)
    private carsRepository = AppDataSource.getRepository(Cars)
    
    async create(req: Request, res: Response): Promise <Response | undefined  >  {
        try { 
            const {cpf_cliente, model } = req.body
            
        const customer = await this.customerRespostiroy.findOne({where: {cpf : cpf_cliente }})
        const car = await this.carsRepository.findOne({where: {model: model}})
        // const checkCar = await this.requestRepository.find({
        //     relations: {
        //         customer: true
        //     },

        //     where: {
        //         customer: {
        //             cpf: cpf_cliente
        //         }
        //     }})
        

        if (!customer) {
            return res.json("Doesn't exist")
        }

        if(!model) {
            return res.json("Does't exist")
        }
        

       
        
        // if(checkCar != null) {
        //    return res.json("Ja existe um cadastro no sistema")
        // }

        const orderRequest = this.requestRepository.create({
            customer: cpf_cliente,
            cars: car,
        })
        
        await this.requestRepository.save(orderRequest)
        return res.json("OK")
        }catch (error) {
            console.log(error)

        }
    }

    async show(req: Request, res: Response): Promise<Response | string | any> {
        try {
            const rental = await this.requestRepository
            .createQueryBuilder('rentalRequest')
            .leftJoinAndSelect('rentalRequest.customer', 'customer')
            .leftJoinAndSelect('rentalRequest.cars', 'cars')
            .select([
                'rentalRequest.id',           
                'customer.id',
                'customer.fullName',
                'cars.id',
                'cars.model',
            ])
            .getMany();
            
            
            return res.json(rental)
        } catch (error) {
            console.log(error)
        }
    }
}






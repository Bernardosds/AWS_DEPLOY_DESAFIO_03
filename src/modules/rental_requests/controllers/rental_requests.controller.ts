import AppDataSource from '../../../db/data-source'; 
import {Request, Response} from 'express'
import RentalRequest from '../entities/rental_request';
import Customer from '../../customers/entities/Customer';
import Cars from '../../cars/entities/Cars';


export class RentalRequestController {
    private requestRepository = AppDataSource.getRepository(RentalRequest)
    private customerRespostiroy = AppDataSource.getRepository(Customer)
    private carsRepository = AppDataSource.getRepository(Cars)
    
    async create(req: Request, res: Response): Promise <Response | undefined >  {
        try { 
            const {cpf_cliente, model } = req.body

        const customer = await this.customerRespostiroy.findOne({where: {cpf : cpf_cliente }})
        const car = await this.carsRepository.findOne({where: {model: model}})
        const checkRequest = await this.requestRepository.find({
            relations: {
                customer: true
            },

            where: {
                customer: {
                    cpf: cpf_cliente
                }
            }})
        console.log(checkRequest)
        
        if(!car) {
            return res.json("Does't exist")
        }

            if (!customer) {
                return res.json("Doesn't exist")
            }

                if(!model) {
                    return res.json("Does't exist")
                } 
                
                    if(checkRequest.length > 0) {
                        return res.json("Ja existe um cadastro no sistema")
                    }

        const orderRequest = this.requestRepository.create({
            customer,
            cars: car,
        })
        
        
        await this.requestRepository.save(orderRequest)
        return res.json("OK")
        }catch (error) {
            console.log(error)

        }
    }
    async showById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const rental = await this.requestRepository
                .createQueryBuilder('rentalRequest')
                .leftJoinAndSelect('rentalRequest.customer', 'customer')
                .leftJoinAndSelect('rentalRequest.cars', 'cars')
                .select([
                    'rentalRequest.id',
                    'rentalRequest.statusRequest',
                    'rentalRequest.dateRequest',
                    'rentalRequest.startDate',
                    'rentalRequest.endDate',
                    'rentalRequest.rentalTax',
                    'rentalRequest.totalValue',
                    'rentalRequest.cep',
                    'rentalRequest.uf',
                    'rentalRequest.cidade',
                    'customer.id',
                    'customer.fullName',
                    'customer.cpf',
                ])
                .where('rentalRequest.id = :id', { id })
                .getOne();
    
            if (!rental) {
                return res.status(404).json({ message: "Pedido de aluguel não encontrado." });
            }
    
            return res.json(rental);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar o pedido de aluguel.", error });
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        try {
            const rentals = await this.requestRepository
                .createQueryBuilder('rentalRequest')
                .leftJoinAndSelect('rentalRequest.customer', 'customer')
                .leftJoinAndSelect('rentalRequest.cars', 'cars')
                .select([
                    'rentalRequest.id',
                    'rentalRequest.statusRequest',
                    'rentalRequest.dateRequest',
                    'rentalRequest.startDate',
                    'rentalRequest.endDate',
                    'rentalRequest.rentalTax',
                    'rentalRequest.totalValue',
                    'rentalRequest.cep',
                    'rentalRequest.uf',
                    'rentalRequest.cidade',
                    'customer.id',
                    'customer.fullName',
                    'customer.cpf',
                ])
                .getMany();
    
            return res.json(rentals);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao listar os pedidos de aluguel.", error });
        }
    }
}






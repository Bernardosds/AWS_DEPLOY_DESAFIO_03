import AppDataSource from '../../../db/data-source'; 
import {Request, Response} from 'express'
import Order from '../entities/OrderEntity';
import Customer from '../../customers/entities/Customer';
import Cars from '../../cars/entities/Cars';
import { getData } from './getCEP';
import AppError from '../../../shared/errors/AppError';
import fretePorUF from './checkUF';
//import { getCurrentDate } from './checkdata';
import { parse, isBefore, differenceInDays } from 'date-fns';

import { formatPlate } from '../../cars/services/formatters';
export class OrderController {
  private orderRespository = AppDataSource.getRepository(Order)
  private customerRespostory = AppDataSource.getRepository(Customer)
  private carsRepository = AppDataSource.getRepository(Cars)
  
  async create(req: Request, res: Response): Promise <Response | undefined > {
    try { 
          const {cpf_cliente, plate } = req.body
          const formattedPlate = formatPlate(plate)
        const customer = await this.customerRespostory.findOne({where: {cpf : cpf_cliente }})
        const car = await this.carsRepository.findOne({where: {plate: formattedPlate}})
        
          const checkRequest = await this.orderRespository.find({
              relations: {               customer: true
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

                if(!plate) {
                    return res.json("Does't exist")
                } 
                
                    if(checkRequest.length > 0) {
                        return res.json("There is already a registration in the system")
                    }
     

        const orderRequest = this.orderRespository.create({
            customer: customer,
            car: car,
            statusRequest: "Aberto",
        })
        console.log(orderRequest)
        
        await this.orderRespository.save(orderRequest)
        
        return res.status(200).json(orderRequest)
        }catch (error) {
            console.log(error)

        }
    }

    
    async showById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const rental = await this.orderRespository
                .createQueryBuilder('order')
                .leftJoinAndSelect('order.customer', 'customer')
                .leftJoinAndSelect('order.car', 'car')
                .select([
                    'order.id',
                    'order.statusRequest',
                    'order.dateRequest',
                    'order.startDate',
                    'order.endDate',
                    'order.rentalTax',
                    'order.totalValue',
                    'order.cep',
                    'order.uf',
                    'order.city',
                    'customer.id',
                    'customer.fullName',
                    'customer.cpf',
                ])
                .where('order.id = :id', { id })
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
    async show(req: Request, res: Response): Promise<Response | null | string | number > {
      try {
         const { status, cpf, startDate, endDate, page = 1, limit = 10, order = 'dateRequest', direction = 'DESC' } = req.query;
       
         const query = this.orderRespository
                  .createQueryBuilder('order')
                  .leftJoinAndSelect('order.customer', 'customer')
                  .leftJoinAndSelect('order.car', 'car')
                  .select([
                    'order.id',
                    'order.statusRequest',
                    'order.dateRequest',
                    'order.startDate',
                    'order.endDate',
                    'order.rentalTax',
                    'order.totalValue',
                    'order.cep',
                    'order.uf',
                    'order.city',
                    'customer.id',
                    'customer.fullName',
                    'customer.cpf',
                  ]);
            
                
                if (status) {
                  query.andWhere('order.statusRequest = :status', { status });
                }
            
               
                if (cpf) {
                  query.andWhere('customer.cpf = :cpf', { cpf });
                }
            
               
                if (startDate && endDate) {
                  query.andWhere('order.dateRequest BETWEEN :startDate AND :endDate', { startDate, endDate });
                } else if (startDate) {
                  query.andWhere('order.dateRequest >= :startDate', { startDate });
                } else if (endDate) {
                  query.andWhere('order.dateRequest <= :endDate', { endDate });
                }
            
             
                query.orderBy(`order.${order}`, direction.toString().toUpperCase() === 'ASC' ? 'ASC' : 'DESC');                  
                const total = await query.getCount(); 
                  const rentals = await query
                  .skip((Number(page) - 1) * Number(limit)) 
                  .take(Number(limit)) 
                  .getMany();

  
                return res.json({
                  data: rentals,
                  pagination: {
                    total,
                    page: Number(page),
                    lastPage: Math.ceil(total / Number(limit)),
                    limit: Number(limit),
                  },
                });
              } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Erro ao listar os pedidos de aluguel.', error });
              }
           }
           
           
           public async update(req: Request, res: Response): Promise<Response> {
            try {
              const { id } = req.params;
        
              const order = await this.orderRespository.findOne({ where: { id }, relations: ['car'] });
              if (!order) {
                throw new AppError("Pedido não encontrado", 404);
              }
        
              const { cep, startDate, endDate, statusRequest } = req.body;
              console.log("Dados recebidos no req.body:");
              console.log("startDate:", startDate);
              console.log("endDate:", endDate);
        
              // Definir o formato da data para 'dd/MM/yyyy'
              const dateFormat = 'dd/MM/yyyy';
        
              // Validação de datas usando date-fns
              if (startDate) {
                console.log("startDate recebida:", startDate);
                const start = parse(startDate, dateFormat, new Date());
                console.log("Data inicial após parse:", start);
        
                if (isNaN(start.getTime())) {
                  throw new AppError("Data inicial inválida", 400);
                }
        
                if (isBefore(start, new Date())) {
                  throw new AppError("Data inicial não pode ser menor que a data atual", 400);
                }
        
                order.startDate = start;
                console.log("order.startDate após atribuição:", order.startDate);
              }
        
              if (endDate) {
                console.log("endDate recebida:", endDate);
                const end = parse(endDate, dateFormat, new Date());
                console.log("Data final após parse:", end);
        
                if (isNaN(end.getTime())) {
                  throw new AppError("Data final inválida", 400);
                }
        
                if (isBefore(end, order.startDate || new Date())) {
                  throw new AppError("Data final não pode ser menor que a data inicial", 400);
                }
        
                order.endDate = end;
                console.log("order.endDate após atribuição:", order.endDate);
              }
        
              // Processamento do CEP
              if (cep) {
                const cep_cliente = cep.toString().trim().replace('-', '');
        
                if (cep_cliente.length !== 8) {
                  throw new AppError("CEP deve ter 8 dígitos", 400);
                }
        
                const data = await getData(cep_cliente);
                if (!data) {
                  throw new AppError("CEP não encontrado", 404);
                }
                console.log("Dados do CEP:", data);
        
                const uf = data.uf;
                let valorFrete = fretePorUF[uf];
        
                if (valorFrete === undefined) {
                  valorFrete = 170.00;
                }
        
                // Atualizar campos relacionados ao endereço
                order.cep = data.cep;
                order.city = data.localidade; // Certifique-se de que 'city' é o campo correto na entidade Order
                order.uf = uf;
                order.rentalTax = valorFrete;
              }
        
              // Validação do status
              if (statusRequest) {
                const status = statusRequest.toLowerCase();
        
                if (status !== "aprovado" && status !== "fechado" && status !== "cancelado") {
                  throw new AppError("Status inválido", 400);
                }
        
                // Implementar regras específicas para cada status
                if (status === "aprovado") {
                  if (order.statusRequest !== "aberto") {
                    throw new AppError("Apenas pedidos abertos podem ser aprovados", 400);
                  }
        
                  // Verificar se todos os campos obrigatórios estão preenchidos
                  if (
                    !order.startDate ||
                    !order.endDate ||
                    !order.cep ||
                    !order.city ||
                    !order.uf ||
                    order.rentalTax === undefined
                  ) {
                    throw new AppError("Todos os campos devem estar preenchidos para aprovar o pedido", 400);
                  }
        
                  order.statusRequest = "aprovado";
                } else if (status === "cancelado") {
                  if (order.statusRequest !== "aberto") {
                    throw new AppError("Apenas pedidos abertos podem ser cancelados", 400);
                  }
        
                  order.statusRequest = "cancelado";
                  order.cancelDate = new Date();
                } else if (status === "fechado") {
                  if (order.statusRequest !== "aprovado") {
                    throw new AppError("Apenas pedidos aprovados podem ser fechados", 400);
                  }
        
                  const today = new Date();
                  const end = order.endDate || today;
        
                  if (isBefore(end, today)) {
                    const diasUltrapassados = differenceInDays(today, end);
                    const dailyRate = Number(order.car.daily_price) || 0;
        
                    order.fine = dailyRate * 2 * diasUltrapassados;
                  }
        
                  order.statusRequest = "fechado";
                  order.finishDate = today;
                }
              }
        
              // Cálculo do valor total
              if (order.startDate && order.endDate) {
                const rentalDays = differenceInDays(order.endDate, order.startDate) || 1; // Pelo menos 1 dia
                const dailyRate = Number(order.car.daily_price) || 0;
                const totalDailyRate = rentalDays * dailyRate;
        
                order.totalValue = totalDailyRate + (order.rentalTax || 0) + (order.fine || 0);
              }
        
              console.log("Estado do order antes de salvar:", order);
        
              await this.orderRespository.save(order);
        
              console.log("Estado do order após salvar:", order);
        
              return res.status(200).json(order);
            } catch (error) {
              console.error(error);
              if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
              }
              return res.status(500).json({ error: "Internal Server Error" });
            }
          }
        }
          // async delete(req: Request, res: Response): Promise<Response | string> {
          //   const {id} = req.query
          //   if(!id) {
          //     throw new AppError("ID INVALID", 400)
          //   }
          //   const checkStauts = await this.orderRespository.findOne({id} )
          //     if(checkStauts?.statusRequest == "Aberto") {
          //       await this.orderRespository.softDelete({id})
          //     }
          //     //return id

          //   }
          // }
               


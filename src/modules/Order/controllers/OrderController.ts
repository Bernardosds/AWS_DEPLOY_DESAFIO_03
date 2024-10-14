import AppDataSource from '../../../db/data-source';
import { Request, Response } from 'express';
import Order from '../entities/OrderEntity';
import Customer from '../../customers/entities/Customer';
import Cars from '../../cars/entities/Cars';
import { getData } from './getCEP';
import AppError from '../../../shared/errors/AppError';
import fretePorUF from './checkUF';
import { In } from 'typeorm';
import { parse, isBefore, differenceInDays } from 'date-fns';
import { formatPlate } from '../../cars/services/formatters';

export class OrderController {
  private orderRepository = AppDataSource.getRepository(Order);
  private customerRepository = AppDataSource.getRepository(Customer);
  private carsRepository = AppDataSource.getRepository(Cars);

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { cpf_cliente, plate } = req.body;

      if (!cpf_cliente || !plate) {
        throw new AppError(
          'CPF do cliente e placa do carro são obrigatórios.',
          400,
        );
      }

      const formattedPlate = formatPlate(plate);

      const customer = await this.customerRepository.findOne({
        where: { cpf: cpf_cliente },
      });
      if (!customer) {
        throw new AppError('Cliente não encontrado.', 404);
      }

      const car = await this.carsRepository.findOne({
        where: { plate: formattedPlate },
      });
      if (!car) {
        throw new AppError('Carro não encontrado.', 404);
      }

      const existingOrder = await this.orderRepository.findOne({
        relations: ['customer'],
        where: {
          customer: {
            cpf: cpf_cliente,
          },
          statusRequest: In(['aberto', 'aprovado']),
        },
      });

      if (existingOrder) {
        throw new AppError('O cliente já possui um pedido em aberto.', 400);
      }

      const orderRequest = this.orderRepository.create({
        customer: customer,
        car: car,
        statusRequest: 'aberto',
      });

      await this.orderRepository.save(orderRequest);

      res.status(201).json({
        status: 'success',
        data: orderRequest,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: 'error', message: error.message });
      }
      res
        .status(500)
        .json({ status: 'error', message: 'Erro interno do servidor.' });
    }
  }

  async showById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const rental = await this.orderRepository
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
          'customer.email',
          'customer.cpf',
          'car.id',
          'car.brand',
          'car.model',
          'car.year',
          'car.mileage',
          'car.items',
          'car.plate',
          'car.daily_price',
        ])
        .where('order.id = :id', { id })
        .getOne();

      if (!rental) {
        throw new AppError('order not found', 404);
      }

      rental.rentalTax = Number(rental.rentalTax);
      rental.totalValue = Number(rental.totalValue);
      rental.car.daily_price = Number(rental.car.daily_price);

      if (typeof rental.car.items === 'string') {
        rental.car.items = JSON.parse(rental.car.items);
      }

      res.status(200).json({
        status: 'success',
        data: rental,
      });
    } catch {
      throw new AppError('could not find order', 404);
    }
  }

  async show(req: Request, res: Response): Promise<void> {
    try {
      const { status, cpf, startDate, endDate } = req.query;
      const {
        page = '1',
        limit = '10',
        order = 'dateRequest',
        direction = 'DESC',
      } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      if (isNaN(pageNumber) || pageNumber < 1) {
        throw new AppError('Página inválida.', 400);
      }

      if (isNaN(limitNumber) || limitNumber < 1) {
        throw new AppError('Limite inválido.', 400);
      }

      const validOrderFields = ['dateRequest'];
      const validDirections = ['ASC', 'DESC'];

      const orderField = validOrderFields.includes(order as string)
        ? order
        : 'dateRequest';
      const orderDirection = validDirections.includes(
        direction?.toString().toUpperCase() || 'DESC',
      )
        ? direction.toString().toUpperCase()
        : 'DESC';

      const query = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.customer', 'customer')
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
        query.andWhere('order.dateRequest BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      } else if (startDate) {
        query.andWhere('order.dateRequest >= :startDate', { startDate });
      } else if (endDate) {
        query.andWhere('order.dateRequest <= :endDate', { endDate });
      }

      query.orderBy(`order.${orderField}`, orderDirection as "DESC"|"ASC");

      const total = await query.getCount();

      const rentals = await query
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getMany();

      if (rentals.length === 0) {
          res.status(200).json({
          status: 'success',
          message: 'Nenhum pedido de aluguel encontrado.',
          data: [],
          pagination: {
            total,
            page: pageNumber,
            lastPage: 0,
            limit: limitNumber,
          },
        });
      }

      rentals.forEach(rental => {
        rental.rentalTax = Number(rental.rentalTax);
        rental.totalValue = Number(rental.totalValue);
      });

      res.status(200).json({
        status: 'success',
        data: rentals,
        pagination: {
          total,
          page: pageNumber,
          lastPage: Math.ceil(total / limitNumber),
          limit: limitNumber,
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
       throw new AppError('could not list orders', 404);
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['car'],
      });
      if (!order) {
        throw new AppError('Pedido não encontrado', 404);
      }

      const { cep, startDate, endDate, statusRequest } = req.body;
      console.log('Dados recebidos no req.body:');
      console.log('startDate:', startDate);
      console.log('endDate:', endDate);

      // Definir o formato da data para 'dd/MM/yyyy'
      const dateFormat = 'dd/MM/yyyy';

      // Validação de datas usando date-fns
      if (startDate) {
        console.log('startDate recebida:', startDate);
        const start = parse(startDate, dateFormat, new Date());
        console.log('Data inicial após parse:', start);

        if (isNaN(start.getTime())) {
          throw new AppError('Data inicial inválida', 400);
        }

        if (isBefore(start, new Date())) {
          throw new AppError(
            'Data inicial não pode ser menor que a data atual',
            400,
          );
        }

        order.startDate = start;
        console.log('order.startDate após atribuição:', order.startDate);
      }

      if (endDate) {
        console.log('endDate recebida:', endDate);
        const end = parse(endDate, dateFormat, new Date());
        console.log('Data final após parse:', end);

        if (isNaN(end.getTime())) {
          throw new AppError('Data final inválida', 400);
        }

        if (isBefore(end, order.startDate || new Date())) {
          throw new AppError(
            'Data final não pode ser menor que a data inicial',
            400,
          );
        }

        order.endDate = end;
        console.log('order.endDate após atribuição:', order.endDate);
      }

      if (cep) {
        const cep_cliente = cep.toString().trim().replace('-', '');

        if (cep_cliente.length !== 8) {
          throw new AppError('CEP deve ter 8 dígitos', 400);
        }

        const data = await getData(cep_cliente);
        if (!data) {
          throw new AppError('CEP não encontrado', 404);
        }
        console.log('Dados do CEP:', data);

        const uf = data.uf;
        let valorFrete = fretePorUF[uf];

        if (valorFrete === undefined) {
          valorFrete = 170.0;
        }

        order.cep = data.cep;
        order.city = data.localidade;
        order.uf = uf;
        order.rentalTax = valorFrete;
      }

      if (statusRequest) {
        const status = statusRequest.toLowerCase();

        if (
          status !== 'aprovado' &&
          status !== 'fechado' &&
          status !== 'cancelado'
        ) {
          throw new AppError('Status inválido', 400);
        }

        if (status === 'aprovado') {
          if (order.statusRequest !== 'aberto') {
            throw new AppError(
              'Apenas pedidos abertos podem ser aprovados',
              400,
            );
          }

          if (
            !order.startDate ||
            !order.endDate ||
            !order.cep ||
            !order.city ||
            !order.uf ||
            order.rentalTax === undefined
          ) {
            throw new AppError(
              'Todos os campos devem estar preenchidos para aprovar o pedido',
              400,
            );
          }

          order.statusRequest = 'aprovado';
        } else if (status === 'cancelado') {
          if (order.statusRequest !== 'aberto') {
            throw new AppError(
              'Apenas pedidos abertos podem ser cancelados',
              400,
            );
          }

          order.statusRequest = 'cancelado';
          order.cancelDate = new Date();
        } else if (status === 'fechado') {
          if (order.statusRequest !== 'aprovado') {
            throw new AppError(
              'Apenas pedidos aprovados podem ser fechados',
              400,
            );
          }

          const today = new Date();
          const end = order.endDate || today;

          if (isBefore(end, today)) {
            const diasUltrapassados = differenceInDays(today, end);
            const dailyRate = Number(order.car.daily_price) || 0;

            order.fine = dailyRate * 2 * diasUltrapassados;
          }

          order.statusRequest = 'fechado';
          order.finishDate = today;
        }
      }

      if (order.startDate && order.endDate) {
        const rentalDays =
          differenceInDays(order.endDate, order.startDate) || 1; // Pelo menos 1 dia
        const dailyRate = Number(order.car.daily_price) || 0;
        const totalDailyRate = rentalDays * dailyRate;

        order.totalValue =
          totalDailyRate + (order.rentalTax || 0) + (order.fine || 0);
      }

      console.log('Estado do order antes de salvar:', order);

      await this.orderRepository.save(order);

      console.log('Estado do order após salvar:', order);

      res.status(200).json({
        status: 'success',
        data: order,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: 'error', message: error.message });
      }
      res
        .status(500)
        .json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  async cancelOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['customer', 'car'],
      });

      // Verificar se o pedido existe
      if (!order) {
        return res.status(404).json({
          status: 'error',
          message: 'Pedido de aluguel não encontrado.',
        });
      }

      if (order.statusRequest !== 'aberto') {
        return res.status(400).json({
          status: 'error',
          message: 'Apenas pedidos com status "aberto" podem ser cancelados.',
        });
      }

      order.statusRequest = 'cancelado';
      await this.orderRepository.save(order);

      return res.status(200).json({
        status: 'success',
        message: 'Pedido de aluguel cancelado com sucesso.',
        data: {
          id: order.id,
          statusRequest: order.statusRequest,
          dateRequest: order.dateRequest,
          startDate: order.startDate,
          endDate: order.endDate,
          rentalTax: Number(order.rentalTax),
          totalValue: Number(order.totalValue),
          cep: order.cep,
          city: order.city,
          uf: order.uf,
          customer: {
            id: order.customer.id,
            fullName: order.customer.fullName,
            cpf: order.customer.cpf,
          },
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      throw new AppError('could not cancel order', 404);
    }
  }
}

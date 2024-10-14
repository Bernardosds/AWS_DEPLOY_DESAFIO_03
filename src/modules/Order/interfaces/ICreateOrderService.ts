type CreateOrderParams = {
    cpf_client: string
    car_plate: string
  }
  
  export default interface ICreateOrderService {
    execute(data: CreateOrderParams): Promise<string>
  }
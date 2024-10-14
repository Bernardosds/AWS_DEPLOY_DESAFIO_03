import IOrder from "./IOrder";


export default interface IOrderRepository extends IOrder {
  create(cpf: string, car_plate: string): Promise<string>;
  readById(id: string): Promise<IOrder | null>;
  read(): Promise<IOrder[]>;
  delete(id: string): Promise<void>;
  update(id: string, data: Partial<IOrder>): Promise<IOrder | null>;
}

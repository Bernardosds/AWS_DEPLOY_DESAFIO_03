import Cars from "../../cars/entities/Cars";
import Customer from "../../customers/entities/Customer";

export default interface IOrder {
  id?: string;
  dateRequest?: Date;
  statusRequest?: string;
  cep?: string;
  cidade?: string;
  uf?: string;
  rentalTax?: number;
  totalValue?: number;
  startDate?: Date;
  endDate?: Date;
  cancelDate?: Date;
  finishDate?: Date;
  fine?: number;
  car_plate: Cars;
  customer_cpf: Customer;
}

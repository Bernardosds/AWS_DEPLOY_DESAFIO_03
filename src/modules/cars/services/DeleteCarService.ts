import Cars from '../entities/Cars';
import AppDataSource from '../../../db/data-source';
import CarStatus from '../interface/CarStatus';
import Order from '../../Order/entities/OrderEntity';

class DeleteCarService {
  deleteCar = async (id: string): Promise<void> => {
    const carsRepository = AppDataSource.getRepository(Cars);
    const orderRepository = AppDataSource.getRepository(Order)

    const car = await carsRepository.findOneBy({ id });

    if (!car) {
      throw new Error('Car not found!');
    }
    if (car.status == CarStatus.Deleted) {
      throw new Error('This car is already deleted!');
    }

    const order = await orderRepository.findOneBy({ id });
    console.log(order);
    if(order){
      const statusRequest = order.statusRequest
      if (statusRequest !== "cancelado" && statusRequest !== "fechado") {
        throw new Error('This car can\'t be deleted due to outstanding issues or open orders');
      }
    }
    
    car.status = CarStatus.Deleted;

    await carsRepository.save(car);
  };
}
export default DeleteCarService;

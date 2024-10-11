import Cars from '../entities/Cars';
import AppDataSource from '../../../db/data-source';
import CarStatus from '../interface/CarStatus';

class DeleteCarService {
  deleteCar = async (id: string): Promise<void> => {
    const carsRepository = AppDataSource.getRepository(Cars);
    const car = await carsRepository.findOneBy({ id });

    if (!car) {
      throw new Error('Car not found!');
    } else if (car.status == CarStatus.Deleted) {
      throw new Error('This car is already deleted!');
    }

    car.status = CarStatus.Deleted;

    await carsRepository.save(car);
  };
}
export default DeleteCarService;

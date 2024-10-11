import Cars from '../entities/Cars';
import AppDataSource from '../../../db/data-source';

class ShowCarService {
  findCarById = async (id: string) => {
    const carsRepository = AppDataSource.getRepository(Cars);

    const car = await carsRepository.findOneBy({ id });

    if (!car) {
      throw new Error('Car not found');
    }

    car.items = JSON.parse(car.items!);
    car.items = Array.isArray(car.items) ? car.items.join(', ') : '';

    return car;
  };
}
export default ShowCarService;

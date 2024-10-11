import Cars from '../entities/Cars';
import { AppDataSource } from 'src/db/data-source';

export const carsRepository = AppDataSource.getRepository(Cars);

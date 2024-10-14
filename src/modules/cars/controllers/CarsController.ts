import { Request, Response } from 'express';
import AppDataSource from '../../../db/data-source';
import Cars from '../entities/Cars';
import ICars from '../interface/ICars';
import { createCarValidator, updateCarValidator } from '../services/validators';
import CarsService from '../services';
import Joi from 'joi';

export class CarsController {
  constructor(
    private createCarService: InstanceType<
      (typeof CarsService)['CreateCarService']
    >,
    private listCarsService: InstanceType<
      (typeof CarsService)['ListCarsService']
    >,
    private showCarService: InstanceType<
      (typeof CarsService)['ShowCarService']
    >,
    private updateCarService: InstanceType<
      (typeof CarsService)['UpdateCarService']
    >,
    private deleteCarService: InstanceType<
      (typeof CarsService)['DeleteCarService']
    >,
  ) {}

  carsRepository = AppDataSource.getRepository(Cars);

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = createCarValidator.validate(req.body);

      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }

      const newCar = await this.createCarService.createCar(req.body);

      res.status(201).json(newCar);
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ message: typedError.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id.trim();

      const car = await this.showCarService.findCarById(id);

      res.status(200).json(car);
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ message: typedError.message });
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = req.query;
      const carsResponse = await this.listCarsService.listCars(filters);

      if (carsResponse && carsResponse.cars && carsResponse.cars.length > 0) {
        carsResponse.cars.forEach(car => {
          if (car.items) {
            car.items = JSON.parse(car.items);
          }
        });
      } else {
        throw new Error('Car not found');
      }
      res.status(200).json(carsResponse);
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        res.status(400).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  updateCar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id.trim();
      const updates: Partial<ICars> = req.body;

      if (updates.status !== undefined) {
        res.status(400).json({ message: 'The status field cannot be updated' });
        return;
      }

      const { error } = updateCarValidator.validate(updates);

      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }

      const updatedCar = await this.updateCarService.updateCar(id, updates);

      res.status(201).json(updatedCar);
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ message: typedError.message });
    }
  };

  deleteCar = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id.trim();

    try {
      await this.deleteCarService.deleteCar(id);

      res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
      console.log(error);
      const typedError = error as Error;
      if (
        typedError.message === 'Car not found!' ||
        typedError.message === 'This car is already deleted!'
      ) {
        res.status(404).json({ message: typedError.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
}

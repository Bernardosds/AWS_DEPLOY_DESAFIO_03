import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../../../db/data-source';
import Cars from '../entities/Cars';
import ICars from '../interface/ICars';
import { createCarValidator, updateCarValidator } from '../services/validator';
import CarsService from '../services/CarsService';
import listCarsService from '../services/listCarsService';
import Joi from 'joi';

export class CarsController {
  private carsService: CarsService;
  private listCarsService: listCarsService;

  constructor() {
    this.carsService = new CarsService();
    this.listCarsService = new listCarsService();
  }

  carsRepository = AppDataSource.getRepository(Cars);

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = createCarValidator.validate(req.body);

      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }

      const newCar = await this.carsService.createCar(req.body);

      res.status(201).json(newCar);
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ message: typedError.message });
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = req.query;
      const cars = await this.listCarsService.listCars(filters);

      res.status(200).json(cars);
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

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id.trim();

      const car = await this.carsService.findCarById(id);

      res.status(200).json(car);
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ message: typedError.message });
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

      const updatedCar = await this.carsService.updateCar(id, updates);

      res.status(201).json(updatedCar);
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ message: typedError.message });
    }
  };

  deleteCar = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id.trim();

    try {
      await this.carsService.deleteCar(id);

      res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
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

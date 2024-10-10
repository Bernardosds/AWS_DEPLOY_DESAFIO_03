import { Request, Response } from 'express';
import ICreateUserService from '../models/ICreateUserServices';

export default class UsersController {
  private createUserService: ICreateUserService;

  constructor(createUserService: ICreateUserService) {
    this.createUserService = createUserService;
  }

  async create(req: Request, res: Response): Promise<void> {
    const user = req.body;

    const id = await this.createUserService.execute(user);

    res.status(201).json({ id });
  }
}

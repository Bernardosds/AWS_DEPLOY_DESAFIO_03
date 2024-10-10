import { Request, Response } from 'express';
import ICreateUserService from '../models/ICreateUserServices';
import IListUsersService from '../models/IListUsersService';
import IPagedList from '../models/IPagedList';
import IUser from '../models/IUser';
import IShowUserService from '../models/IShowUserService';
import IDeleteUserService from '../models/IDeleteUserService';

export default class UsersController {
  private createUserService: ICreateUserService;
  private listUsersService: IListUsersService;
  private showUserService: IShowUserService;
  private deleteUserService: IDeleteUserService;

  constructor(
    createUserService: ICreateUserService,
    listUsersService: IListUsersService,
    showUserService: IShowUserService,
    deleteUserService: IDeleteUserService,
  ) {
    this.createUserService = createUserService;
    this.listUsersService = listUsersService;
    this.showUserService = showUserService;
    this.deleteUserService = deleteUserService;
  }

  async create(req: Request, res: Response): Promise<void> {
    const user = req.body;

    const id = await this.createUserService.execute(user);

    res.status(201).json({ id });
  }

  async listUsers(req: Request, res: Response): Promise<void> {
    let filters = {};

    let sort = {
      field: 'createdAt' as keyof IUser,
      order: 'ASC' as 'ASC' | 'DESC',
    };

    let pagination = {
      page: 1,
      size: 10,
    };

    if (req.query.filters) {
      filters = JSON.parse(req.query.filters as string);
    }

    if (req.query.sort) {
      sort = JSON.parse(req.query.sort as string);
    }

    if (req.query.pagination) {
      pagination = JSON.parse(req.query.pagination as string);
    }

    const users: IPagedList<IUser> = await this.listUsersService.execute({
      filters,
      sort,
      pagination,
    });

    res.status(200).json(users);
  }

  async show(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const user = await this.showUserService.execute(id);

    res.status(200).json({ user });
  }

  async remove(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this.deleteUserService.execute(id);

    res.status(200).json({});
  }
}

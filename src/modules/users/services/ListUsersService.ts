import IUsersRepository from '../models/IUsersRepository';
import IFindUsersOptions from '../models/IFindUsersOptions';
import IListUsersService from '../models/IListUsersService';
import IUser from '../models/IUser';
import IPagedList from '../models/IPagedList';
import AppError from '../../../shared/errors/AppError';

export default class ListUsersService implements IListUsersService {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(options: IFindUsersOptions): Promise<IPagedList<IUser>> {
    const [users, totalResults] = await this.usersRepository.findAll(options);

    const totalPages = Math.ceil(totalResults / options.pagination.size);

    if (!users) {
      throw new AppError('Users not found', 400);
    }

    return {
      totalPages,
      currentPage: options.pagination.size,
      totalResults,
      pageResults: users.length,
      data: users,
    };
  }
}

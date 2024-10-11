import AppError from '../../../shared/errors/AppError';
import IHashProvider from '../models/IHashProvider';
import IUpdateUserService from '../models/IUpdateUserService';
import IUser from '../models/IUser';
import IUsersRepository from '../models/IUsersRepository';

export default class UpdateUserService implements IUpdateUserService {
  private usersRepository: IUsersRepository;
  private hashProvider: IHashProvider;

  constructor(usersRepository: IUsersRepository, hashProvider: IHashProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ id, name, email, password }: IUser): Promise<IUser> {
    if (!id) {
      throw new AppError('user id is required', 400);
    }

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('user is required', 404);
    }

    if (name) {
      if (name.split(' ').length < 2) {
        throw new AppError('full name is required', 400);
      }

      user.name = name;
    }

    if (email) {
      const emailRegex = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if (!emailRegex.test(email)) {
        throw new AppError('email format is invalid', 400);
      }

      const emailDuplicate = await this.usersRepository.findByEmail(email);

      if (emailDuplicate) {
        throw new AppError(
          'a user with this email address already exists',
          409,
        );
      }

      user.email = email;
    }

    if (password) {
      if (password.length < 8) {
        throw new AppError('password must be at least 8 characters long', 400);
      }

      if (password) {
        password = await this.hashProvider.generateHash(password);
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    const updatedUser = await this.usersRepository.update(id, user);

    if (!updatedUser) {
      throw new AppError('Error updating user', 500);
    }

    return updatedUser;
  }
}

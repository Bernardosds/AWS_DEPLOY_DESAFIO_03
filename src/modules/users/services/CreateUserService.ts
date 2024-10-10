import Error from '../../../shared/errors/Errors';
import IUser from '../models/IUser';
import IUsersRepository from '../models/IUsersRepository';
import IHashProvider from '../models/IHashProvider';
import ICreateUserService from '../models/ICreateUserServices';

export default class CreateUser implements ICreateUserService {
  private usersRepository: IUsersRepository;
  private hashProvider: IHashProvider;

  constructor(usersRepository: IUsersRepository, hashProvider: IHashProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ name, email, password }: IUser): Promise<string> {
    if (!name) {
      throw new Error('full name is required', 400);
    }

    if (name.split(' ').length < 2) {
      throw new Error('full name is required', 400);
    }

    if (!email) {
      throw new Error('email is required', 400);
    }

    const emailRegex = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(email)) {
      throw new Error('email format is invalid', 400);
    }

    const emailDuplicate = await this.usersRepository.findByEmail(email);

    if (emailDuplicate) {
      throw new Error('a user with this email address already exists', 409);
    }

    if (!password) {
      throw new Error('password is required', 400);
    }

    if (password.length < 8) {
      throw new Error('password must be at least 8 characters long', 400);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const userId = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!userId) {
      throw new Error('failed to create user', 500);
    }

    return userId;
  }
}

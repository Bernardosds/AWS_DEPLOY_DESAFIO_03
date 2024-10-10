import { Repository } from "typeorm";
import User from "../entities/User";
import IUsersRepository from "../models/IUsersRepository";
import IUser from "../models/IUser";

export default class UsersRepository implements IUsersRepository {
  private usersRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  public async create(user: IUser): Promise<string> {
    const newUser = await this.usersRepository.create(user);
    await this.usersRepository.save(newUser);

    return newUser.id as string;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.usersRepository.findOne({
        where: { email },
    });

    return user;
  }

  public async findById(id: string): Promise<IUser | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    return user || null;
  }

  public async findByName(name: string): Promise<IUser | null> {
    const user = await this.usersRepository.findOne({
      where: { name },
    });

    return user || null;
  }

  public async findAll(): Promise<IUser[]> {
    return await this.usersRepository.find();
  }

  public async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    const result = await this.usersRepository.update(id, user);

    if (result.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }

  public async delete(id: string): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    await this.usersRepository.softRemove(user);
  }
}
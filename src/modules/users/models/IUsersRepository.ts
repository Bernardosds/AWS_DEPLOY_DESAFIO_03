import IUser from './IUser';

export default interface IUsersRepository {
    create(user: IUser): Promise<string>;
    findById(id: string): Promise<IUser | null>;
    findByName(name: string): Promise<IUser | null>;
    findAll(): Promise<IUser[]>;
    update(id: string, user: Partial<IUser>): Promise<IUser | null>;
    delete(id: string): Promise<void>;
}

export default interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    deletedAt: Date;
}
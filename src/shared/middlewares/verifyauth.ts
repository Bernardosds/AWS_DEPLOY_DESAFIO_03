import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppDataSource from '../../db/data-source'; 
import User from '../../modules/users/entities/User'; 
import 'dotenv/config';


type JwtPayload = {
    id: string;
};

interface AuthenticatedRequest extends Request {
    usuario?: User;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | undefined | string > => {
    const { authorization } = req.headers;
    
    if (!authorization) {
        return res.status(403).json({ message: "Não autorizado, token não provido" });
    }

    try {
        const token = authorization.split(' ')[1];
        
        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.API_KEY as string) as JwtPayload;
        
        // Fetch the user from the database
        const userRepository = AppDataSource.getRepository(User);
        
        const usuario = await userRepository.findOne({where: { id: decoded.id }} );

        console.log(usuario);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Attach the user to the req object
        req.usuario = usuario;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Erro na validação do token:', error);
        return res.status(401).json({ message: 'Token não válido' });
    }
};


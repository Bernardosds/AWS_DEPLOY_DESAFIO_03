// src/controllers/authController.ts
import { Request, Response } from "express";
import  AppDataSource  from "../db/data-source";
import User from "../modules/users/entities/User"; 
import jwt from 'jsonwebtoken';
 
import dotenv from "dotenv";
dotenv.config();


export const login = async (req: Request, res: Response): Promise<Response | undefined | string > => {
  const { email, password } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    
    const usuario = await userRepository.findOne({ where: { email, password } });

    if (!usuario) {
      return res.status(400).json({ mensagem: "Email ou senha inválida" });
    }


    const token = jwt.sign({ id: usuario.id }, process.env.API_KEY as string, {
      expiresIn: "8h",
    });

    return res.json({ usuario, token });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ mensagem: "Erro Interno do Servidor" });
  }
};

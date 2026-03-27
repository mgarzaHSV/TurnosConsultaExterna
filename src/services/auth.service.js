import bcrypt from 'bcrypt';
import { ENV } from '../config/env.config.js';
import jwt from 'jsonwebtoken';

export class AuthService{
    constructor(AuthRepository){
        this.AuthRepository = AuthRepository;
    }

    createTemporalCredential = async () =>{
        return await bcrypt.hash(ENV.SESSION_SECRET,10)
    }

    verifyUserAndPassword = async (user, password, KEY) =>{
        const isValid = await bcrypt.compare(ENV.SESSION_SECRET, KEY);
        if (!isValid) {
            throw new Error('Token inválido');
        }
        
        const userVerify = await this.AuthRepository.verifyUserAndPassword(user, password);
        if (!userVerify) return false;
        const token = jwt.sign(
            {
            username: userVerify.username,
            nombre: userVerify.nombre,
            tipo_usr: userVerify.perfil,
            },
            ENV.JWT_SECRET,
            {
            expiresIn: "6h", // 1 hour token expiration
            }
        );
        return token;
        //return await this.AuthRepository.consultarUsuario(validateUser);
    }
}
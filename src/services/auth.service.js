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
        const userExists = await this.AuthRepository.findUserByUsername(user);
        if(!userExists) return false;

        const passwordMatch = await bcrypt.compare(password, userExists.password);

        if(userExists.nombreUsuario === user && passwordMatch) {
            const token = jwt.sign(
                {
                username: userExists.username,
                nombre: userExists.nombre,
                tipo_usr: userExists.perfil,
                },
                ENV.JWT_SECRET,
                {
                expiresIn: "6h", // 1 hour token expiration
                }
            );
            return token;
        };
        return false;
    }
}
import bcrypt from 'bcrypt';
import { ENV } from '../config/env.config.js';
import jwt from 'jsonwebtoken';

/** @typedef {import('../repositories/auth.repository.js').AuthRepository} AuthRepository */
/** @typedef {import('../repositories/rol.repository.js').RolRepository} RolRepository */

export class AuthService{
    /**
     * 
     * @param {AuthRepository} AuthRepository
     * @param {RolRepository} RolRepository
     */
    constructor(AuthRepository, RolRepository){
        this.AuthRepository = AuthRepository;
        this.RolRepository = RolRepository;
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
        const rolExists = await this.RolRepository.consultarRol(userExists.idRol)
        if(!rolExists) return false
        if(!userExists) return false;

        const passwordMatch = await bcrypt.compare(password, userExists.password);

        const dataAccess={
                username: userExists.nombreUsuario,
                nombre: userExists.nombre,
                rol: rolExists.nombreRol
        }
        const secretPassword = ENV.JWT_SECRET
        if(!secretPassword){
            throw new Error("No existe una clase secreta")
        }

        if(userExists.nombreUsuario === user && passwordMatch) {
            const token = jwt.sign(
                dataAccess,
                secretPassword,
                {
                expiresIn: "6h", // 1 hour token expiration
                }
            );
            return token;
        };
        return false;
    }

    getDataOfUser = async(userName)=>{
        const info = await this.AuthRepository.findUserByUsername(userName)
        return info
    }

    isUserLogined = async (username) => {
        const userExists = await this.AuthRepository.verificarInicioSesion(username);
        if (!userExists) {
            throw new Error('Usuario no encontrado');
        }
        return userExists;
    }

    liberarConsultorio = async (username) => {
        const idConsultorio = {'CONS1':1,'CONS2':2,'CONS3':3}[username.username]
        this.AuthRepository.liberarConsultorio(idConsultorio)
    }
}
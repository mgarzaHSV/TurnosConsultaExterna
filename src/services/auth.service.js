import bcrypt from 'bcrypt';
import { ENV } from '../config/env.config.js';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';

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
        if(!ENV.SESSION_SECRET)throw new Error ('No se puede generera la clave debido a la falta de clave de encriptación')
        return await bcrypt.hash(ENV.SESSION_SECRET,10)
    }

    /**
     * 
     * @param {{username:string,password:string}} user 
     * @param {string} KEY 
     * @returns 
     */
    verifyUserAndPassword = async (user, KEY) =>{
        if(!ENV.SESSION_SECRET)throw new Error ('No se puede generera la clave debido a la falta de clave de encriptación')
        const isValid = await bcrypt.compare(ENV.SESSION_SECRET, KEY);
        if (!isValid) {
            throw new Error('Token inválido');
        }
        const userTrying = Usuario.usuarioVerificar(user.username, user.password)
        const userExists = await this.AuthRepository.findUserByUsername(userTrying);
        if(!userExists) return false

        const passwordMatch = await bcrypt.compare(userTrying.password, userExists.password);

        const dataAccess={
                username: userExists.nombreUsuario,
                nombre: userExists.nombre,
                rol: userExists.rol.nombreRol
        }
        const secretPassword = ENV.JWT_SECRET
        if(!secretPassword){
            throw new Error("No existe una clave secreta")
        }

        if(userExists.nombreUsuario === userTrying.nombreUsuario && passwordMatch) {
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

    /**
     * Consulta para obtener el perfil del usuario que inicio sesión y ver el apartado de permiso
     * @param {Usuario} userName 
     * @return Retorna una variable de tipo {@link Usuario} con la informacion del usuario o null en caso de no existir
     */
    getDataOfUser = async(userName)=>{
        const userTrying = Usuario.usuarioVerificar(userName, null)
        try {
            const usuario = await this.AuthRepository.findUserByUsername(userTrying)
            if(!usuario) return null
            return usuario
        } catch (error) {
            console.error("Ocurrio un error al intentar obtener los datos del usuario")
            return null
        }
    }
}
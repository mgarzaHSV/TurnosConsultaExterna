/** @typedef {import('../database/database.js').Database} Database */
 import {Rol} from '../models/Rol.js'
import { Usuario } from '../models/Usuario.js'

export class AuthRepository{
    /**
     * 
     * @param {Database} dataBase Inyeccion de instancia de pool de conexiones a la base de datos
     */
    constructor(dataBase){
        this.dataBase = dataBase
    }

    /**
     * Consulta de nombre de usuario para verificar la exitencia del mismo
     * @param {Usuario} user Variable de tipo {@link Usuario} del cual se va a buscar en base de datos
     * @returns Retorna un tipo de datos {@link Usuario} en dado caso de encontrar coicidencias o null en caso contrario
     */

    findUserByUsername = async (user) =>{
        const query = `SELECT
                                        U.idUsuario,
                                        U.nombreUsuario,
                                        U.nombre,
                                        U.password,
                                        U.idRol,
                                        R.nombreRol
                        FROM			USUARIO U (nolock) 
                        INNER JOIN		ROL R (nolock) 
                        ON				U.idRol = R.idRol
                        WHERE nombreUsuario = '${user.nombreUsuario}'`
        try{
            const resultado = await this.dataBase.consultar(query)
            if(!resultado) return null
            const rol = Rol.registroRol(resultado[0].idRol,resultado[0].nombreRol)
            return new Usuario(resultado[0].idUsuario, resultado[0].nombreUsuario,resultado[0].nombre, resultado[0].password, rol)
        }catch{
            console.error("Error al ejecutar la query")
            return null
        }
    }

    verificarInicioSesion = async (idConsultorio) => {
        const query = `SELECT idMedico FROM CONSULTORIO WHERE idConsultorio = ${idConsultorio}`
        try {
            const resultado = await this.dataBase.consultar(query);
            return resultado[0]
        }catch (error) {
            console.error("Error al ejecutar la query", error);
            throw new Error('Error al verificar el inicio de sesión');    
        }
    }

    liberarConsultorio = async (idConsultorio) => {
        const query = `UPDATE CONSULTORIO SET idMedico = NULL, fechaLogin = NULL WHERE idConsultorio = ${idConsultorio}`;
        try {
            const result = await this.dataBase.consultar(query);
            return result
        } catch (error) {
            console.error("Error al ejecutar la query", error);
            throw new Error('Error al liberar el consultorio');    
        }
    }
}
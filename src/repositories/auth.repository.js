export class AuthRepository{
    constructor(dataBase){
        this.dataBase = dataBase
    }

    /**
     * 
     * @param {string} user Nombre del usuario a buscar
     * @returns Resultado de la busqueda en base de datos, null si no se encuentra el usuario
     */

    findUserByUsername = async (user) =>{
        const query = `SELECT * FROM usuario (nolock) WHERE nombreUsuario = '${user}'`
        try{
            const resultado = await this.dataBase.consultar(query)
            return resultado[0]
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
export class RolRepository {

    /**
     * 
     * @param {*} dataBase 
     */
    constructor(dataBase){
        this.dataBase = dataBase
    }

    /**
     * Consulta para obtener los datos de un rol
     * @param {number} idRol 
     * @returns {Promise<Object|null>} Retorna el registro de la base de datos si es que existe
     */
    consultarRol = async(idRol)=>{
        const query = `SELECT * FROM ROL (NOLOCK) WHERE idRol = ${idRol}`
        try {
            const resultado = await this.dataBase.consultar(query)
            if(!resultado[0]) return null
            return resultado[0]
        } catch (error) {
            console.error("La consulta no puede llevarse a cabo")
            return null
        }
    }
}
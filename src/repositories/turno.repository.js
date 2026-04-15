/** @typedef {import('../database/database.js').Database} Database */

export class TurnoRepository{

    /**
     * 
     * @param {Database} dataBase 
     */
    constructor(dataBase){
        this.dataBase = dataBase
    }

    consultarTurnoMostrar = async ()=>{
        const query = `	SELECT 
                                        * 
                        FROM CITA (NOLOCK) 
                        WHERE estatus IN ('02','03') 
                        ORDER BY horaAsignacion DESC,consultorio DESC, manchester,fechaCreacion,horaCreacion`
        try {
            const result = await this.dataBase.consultar(query)
            return result
        } catch (error) {
            console.error("Error al consultar las citas a mostrar")
            return null            
        }       
    }
}
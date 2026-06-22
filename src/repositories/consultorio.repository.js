/** @typedef {import('../database/database.js').Database} Database*/

export class ConsultorioRepository {
        /**
     * 
     * @param {Database} dataBase 
     */
    constructor(dataBase){
        this.dataBase = dataBase
    }
    getAllMedicosAtencion = async () => {
        const query = `SELECT
                            C.idConsultorio AS [Consultorio],
                            ISNULL(
                                NULLIF(
                                    TRIM(CONCAT(M.nombre, ' ', M.app, ' ', M.apm)),
                                    ''
                                ),
                                'SIN MEDICO'
                            ) AS [NombreCompleto]
                        FROM CONSULTORIO C (NOLOCK)
                        LEFT JOIN MEDICO M (NOLOCK) ON C.idMedico = M.idMedico;`
        try{
            const result = await this.dataBase.consultar(query)
            return result
        }catch(error){
            console.log("Error al consultar medicos en atencion", error)
            return null
        }
    }
}
/** @typedef {import('../database/database.js').Database} Database*/

export class MedicoRepository{
    /**
     * 
     * @param {Database} dataBase 
     */
    constructor(dataBase){
        this.dataBase = dataBase
    }

    getAllMedicos = async () => {
        const query = `SELECT idMedico, CONCAT(nombre, ' ', app,' ',apm) nombreMedico FROM MEDICO (nolock)`
        try {
            const medicos = await this.dataBase.consultar(query)
            return medicos
        } catch (error) {
            console.error('Error al consultar la lista de los medicos:', error)
        }
    }

    guardarMedicoConsultorioTurno = async ( idMedico, idConsultorio ) => {
        try{
            const query = `UPDATE CONSULTORIO SET idMedico = ${idMedico}, fechaLogin = (SELECT SYSDATETIME()) WHERE idConsultorio = '${idConsultorio}'`
            const result = await this.dataBase.consultar(query)
            return {status: '200', message: 'Medico registrador correctamente en consultorio' }
        }catch(error){
            console.log("Error al relacionar a medico y consultorio", error)
        }
    }
}
export class PacienteRepository {

    constructor(dataBase) {
        this.dataBase = dataBase
    }

    createPaciente = async (paciente) => {
        const query = `INSERT INTO PACIENTE(
                                            nombrePaciente,
                                            appPaciente,
                                            apmPaciente,
                                            sexoPaciente,
                                            edadPaciente,
                                            telPaciente
                                            )
                                            OUTPUT INSERTED.idPaciente
                        VALUES              (
                                            '${paciente.nombre}',
                                            '${paciente.apellidoPaterno}',
                                            '${paciente.apellidoMaterno}',
                                            '${paciente.sexo}',
                                            '${paciente.edad}',
                                            '${paciente.telPaciente}'
                                            )`
        try {
            const result = await this.dataBase.consultar(query)
            if(!result) return null
            paciente.idPaciente = result[0].idPaciente
            return paciente   
        } catch (error) {
            console.log("Error al intentar registrar al paciente")
            return null
        }
    }

    getPacienteById = async (idPaciente)=>{
        try {
            const query = `SELECT * FROM PACIENTE (NOLOCK) WHERE idPaciente = ${idPaciente}`
            const paciente = await this.dataBase.consultar(query)
            if(!paciente) return null
            return paciente[0]
        } catch (error) {
            console.error("La consulta para revisar al paciente causo un error" + error)
        }
    }
}
export class PacienteRepository {

    constructor(dataBase) {
        this.dataBase = dataBase
    }

    registrarPaciente = async (pacienteData) =>{
        const query = `INSERT INTO pacientes (nombrePaciente, appPaciente, apmPaciente, fecNacPaciente, sexoPaciente, edadPaciente, telPaciente) VALUES ('${pacienteData.nombre}', '${pacienteData.apellidoPaterno}', '${pacienteData.apellidoMaterno}', '${pacienteData.fechaNacimiento}', '${pacienteData.sexo}', ${pacienteData.edad}, '${pacienteData.telefono}')`
        try {
            const idPaciente = await this.dataBase.consultar(query)
            console.log(idPaciente)
            return idPaciente
        } catch (error) {
            
        }
    }
}
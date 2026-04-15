/** @typedef {import('../repositories/turno.repository.js').TurnoRepository} TurnoRepository */
/** @typedef {import('../repositories/paciente.repository.js').PacienteRepository} PacienteRepository */
export class TurnoService{

    /**
     * 
     * @param {TurnoRepository} TurnoRepository
     * @param {PacienteRepository} PacienteRepository
     */
    constructor(TurnoRepository, PacienteRepository){
        this.TurnoRepository = TurnoRepository
        this.PacienteRepository = PacienteRepository
    }

    consultaTurnos = async ()=>{
        const turnos = await this.TurnoRepository.consultarTurnoMostrar()
        const info = await Promise.all(
        turnos.map(async (element) => {
            const paciente = await this.PacienteRepository.getPacienteById(element.idPaciente);
            return {
                idCita: element.idCita,
                turnName: `${paciente.nombrePaciente} ${paciente.appPaciente} ${paciente.apmPaciente}`,
                triage: element.manchester,
                turn: element.turno,
                edad: paciente.edadPaciente,
                consultorio: element.consultorio
            };
        })
    )
        if(!info) return null
        return info
    }
}
/** @typedef {import('../repositories/medico.respository.js').MedicoRepository} MedicoRepository */
/** @typedef {import('../repositories/cita.repositoy.js').CitaRepository} CitaRepository */
/** @typedef {import('../repositories/paciente.repository.js').PacienteRepository} PacienteRepository */
export class MedicoService{
    /**
     * 
     * @param {MedicoRepository} MedicoRepository 
     * @param {CitaRepository} CitaRepository
     * @param {PacienteRepository} PacienteRepository
     */
    constructor(MedicoRepository,CitaRepository,PacienteRepository){
        this.MedicoRepository = MedicoRepository,
        this.PacienteRepository = PacienteRepository
        this.CitaRepository = CitaRepository
    }

    consultarCitasSinAtender = async () => {
        const infoTurnos = await this.CitaRepository.getAllTurnosPagados()
        const mostrarCita = await Promise.all(
        infoTurnos.map(async (element) => {
            const paciente = await this.PacienteRepository.getPacienteById(element.idPaciente)
            return {
                id: element.idCita,
                paciente: `${paciente.nombrePaciente} ${paciente.appPaciente} ${paciente.apmPaciente}`,
                triage: element.manchester,
                sexo: paciente.sexoPaciente,
                edad: paciente.edadPaciente,
                turno: element.turno
            };
        }))
        return mostrarCita
    }

    asignarMedicoPaciente = async ({idCita, userName}) => {
        const resultado = await this.CitaRepository.asignarMedicoPaciente({userName,idCita})
        return resultado
    }

    consultaTurnosActivosByUserName = async ( userName) => {
        const turnos = await this.CitaRepository.consultarTurnosActivosByUserName(userName)
        const mostrarCita = await Promise.all(
        turnos.map(async (element) => {
            const paciente = await this.PacienteRepository.getPacienteById(element.idPaciente)
            return {
                id: element.idCita,
                paciente: `${paciente.nombrePaciente} ${paciente.appPaciente} ${paciente.apmPaciente}`,
                triage: element.manchester,
                sexo: paciente.sexoPaciente,
                edad: paciente.edadPaciente,
                turno: element.turno
            };
        }))
        return mostrarCita
    }

    finalizarAtencion = async ({ idCita, userName }) => {
        const resultado = await this.CitaRepository.finalizarAtencion({ idCita , userName})
        return resultado
    }
}
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
                turno: element.turno,
                seguimiento: element.seguimiento,
                segundosTranscurridos: element.segundosTranscurridos
            };
        }))
        return mostrarCita
    }

    asignarMedicoPaciente = async ({idCita, userName}) => {
        const turnos = await this.CitaRepository.consultarTurnosActivosByUserName(userName)
        if(turnos.length >= 2) return { code: 102, message: `Actualmente tiene ${turnos.length} turnos en atención. Para asignar uno nuevo, debe finalizar al menos uno.`}
        const resultado = await this.CitaRepository.asignarMedicoPaciente({userName,idCita})
        return {code: 103, message: "Paciente asignado correctamente", turno: resultado}
    }

    consultaTurnosActivosByUserName = async ( userName ) => {
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

    regresarAFila = async ( {idCita , userName }) => {
        const resultado = await this.CitaRepository.regresarPacienteAFila({ idCita , userName })
        return resultado
    }

    finalizarAtencion = async ({ idCita, userName }) => {
        const resultado = await this.CitaRepository.finalizarAtencion({ idCita , userName})
        return resultado
    }
}
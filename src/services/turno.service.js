/** @typedef {import('../repositories/turno.repository.js').TurnoRepository} TurnoRepository */

import { TurnoComponenteDTO } from '../DTOs/Turno/turnoComponente.dto.js'

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

    consultarTurnosRegistradosActivos = async () => {
        const turnos = await this.TurnoRepository.turnosRegistradosActivos()
         const turnosDTO = turnos.map( turno =>{
            return new TurnoComponenteDTO(turno.paciente.nombreCompleto, turno.estatus, turno.turno, turno.manchester)
        })
        return turnosDTO
    }

    consultarTurnosGeneradosActivos = async () =>{
        const turnos = await this.TurnoRepository.getAllInfoTurnos()
        if(!turnos) return []
        const data = turnos.map( turno =>{
            return new TurnoComponenteDTO(turno.paciente.nombreCompleto, turno.estatus, turno.turno, turno.manchester)
        })
        return data
    }

    consultaTurnos = async ()=>{
        const turnos = await this.TurnoRepository.consultarTurnoMostrar()
        console.log(turnos)
        /*const info = await Promise.all(
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
        return info*/
    }
}
import { Paciente } from "../models/Paciente.js";

/** @typedef {import('../repositories/cita.repositoy.js').CitaRepository} CitaRepository */
/** @typedef {import('../repositories/paciente.repository.js').PacienteRepository} PacienteRepository */

export class CitaService {
    constructor(CitaRepository, PacienteRepository){
        /** @type {CitaRepository} */
        this.CitaRepository = CitaRepository;

        /** @type {PacienteRepository} */
        this.PacienteRepository = PacienteRepository
    }

    getAllCitas = async () => {
    let citas = await this.CitaRepository.getAllCitas();
    return citas
    /*
    const mostrarCita = await Promise.all(
        citas.map(async (element) => {
            const paciente = await this.PacienteRepository.getPacienteById(element.idPaciente)
            let dictionary = {
                "01": 'Generado',
                "02": 'Fila',
                "03": 'Atención',
                "04": 'Finalizado',
                "05": 'Cancelado'
            }
            return {
                id: element.turno,
                paciente: `${paciente.nombrePaciente} ${paciente.appPaciente} ${paciente.apmPaciente}`,
                triage: element.manchester,
                estatus: dictionary[element.estatus]
            };
        })
    );

    return mostrarCita;*/
    }
    
    createCita = async (citaData) => {
        let { nombre,apellidoPaterno, apellidoMaterno, triage, edad, sexo, signosVitales } = citaData

        const dictionary = {
            "red":"01",
            "orange": "02",
            "yellow": "03",
            "green": "04",
            "blue": "05"
        }
        triage = dictionary[triage]
        const paciente = new Paciente({nombre,apellidoPaterno,apellidoMaterno, sexo, edad})
        const pacienteGuardado = await this.PacienteRepository.createPaciente(paciente)
        const newCita = await this.CitaRepository.createCita({pacienteGuardado, triage, edad, sexo, signosVitales});
        return newCita;
    }

    getCitaById = async (id) => {
        const cita = await this.CitaRepository.getCitaById(id);
        return cita;
    }
}
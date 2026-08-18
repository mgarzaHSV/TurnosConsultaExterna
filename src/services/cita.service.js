import { DTOCitaTarjeta } from "../DTO/cita.dto.js";
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

    return mostrarCita;
    }
    
    createCita = async (citaData) => {
        let { nombre,apellidoPaterno, apellidoMaterno, triage, edad, sexo, signosVitales, seguimiento, noCuenta } = citaData

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
        const newCita = await this.CitaRepository.createCita({pacienteGuardado, triage, seguimiento, noCuenta});
        return newCita;
    }

    getCitaById = async (id) => {
        const cita = await this.CitaRepository.getCitaById(id);
        return cita;
    }

    /**
     * 
     * @param {number} id Idetificador de turno creado
     * @returns 
     */
    getCitaByIdTarjeta = async (id) =>{
        const cita = await this.CitaRepository.getCitaById(id);
        const paciente = await this.PacienteRepository.getPacienteById(cita.idPaciente)
        return new DTOCitaTarjeta({
            idCita: cita.idCita,
            paciente: `${paciente.nombrePaciente} ${paciente.appPaciente} ${paciente.apmPaciente}`,
            triage: cita.manchester,
            estatus: {
                "01": 'Generado',
                "02": 'Fila',
                "03": 'Atención',
                "04": 'Finalizado',
                "05": 'Cancelado'
            }[cita.estatus],
            turno: cita.turno,
            edad: paciente.edadPaciente,
            color: {
                    '1': 'bg-inmediato',
                    '2': 'bg-muyUrgente',
                    '3': 'bg-urgente',
                    '4': 'bg-normal',
                    '5': 'bg-noUrgente'
                }[cita.manchester],
            noCuenta: cita.noCuenta,
            consultorio: cita.nombre,
            seguimiento: cita.seguimiento
        })
    }
}
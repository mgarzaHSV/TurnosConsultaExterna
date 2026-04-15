/** @typedef {import('../repositories/caja.repository.js').CajaRepository} CajaRepository */
/** @typedef {import('../repositories/cita.repositoy.js').CitaRepository} CitaRepository */
/** @typedef {import('../repositories/paciente.repository.js').PacienteRepository} PacienteRepository */
export class CajaService{
    /**
     * 
     * @param {CajaRepository} CajaRepository 
     * @param {CitaRepository} CitaRepository
     * @param {PacienteRepository} PacienteRepository
     */
    constructor(CajaRepository, CitaRepository,PacienteRepository){
        this.CajaRepository = CajaRepository;
        this.CitaRepository = CitaRepository
        this.PacienteRepository = PacienteRepository
    }

    consultarTurnos = async () => {
    const dataCitasPorCobrar = await this.CitaRepository.getCitasPendientesCobro();

    const info = await Promise.all(
        dataCitasPorCobrar.map(async (element) => {
            const paciente = await this.PacienteRepository.getPacienteById(element.idPaciente);

            let dictionary = {
                "01": 'Generado',
                "02": 'Fila',
                "03": 'Atención',
                "04": 'Finalizado',
                "05": 'Cancelado'
            };

            let triageColor = {
                "1": 'bg-inmediato',
                "2": 'bg-muyUrgente',
                "3": 'bg-urgente',
                "4": 'bg-normal',
                "5": 'bg-noUrgente'
            }

            return {
                idCita: element.idCita,
                paciente: `${paciente.nombrePaciente} ${paciente.appPaciente} ${paciente.apmPaciente}`,
                triage: element.manchester,
                estatus: dictionary[element.estatus],
                turno: element.turno,
                edad: paciente.edadPaciente,
                color: triageColor[element.manchester]
            };
        })
    )
        return info
}

    registrarPago = async({usuario, estatus, turno, idCita})=>{
        const estatusCita = {
            "Pendiente": "01",
            "Proyectada": "02",
            "Asignada": "03",
            "Finalizada": "04" 
        }[estatus]
        try{
            const resultado = await this.CitaRepository.pagarTurnoPaciente({usuario, estatusCita, idCita, turno})
            if(!resultado) return null
            return resultado
        }catch (error){
            console.error("Existio un problema para actualizar el estatus de la cita")
        }
    }
}
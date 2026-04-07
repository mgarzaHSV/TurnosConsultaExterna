export class PacienteService {
    constructor(PacienteRepository){
        this.PacienteRepository = PacienteRepository;
    }

    registrarPaciente = async ({nombrePaciente, appPaciente, apmPaciente, fecNacPaciente, sexoPaciente, edadPaciente, telPaciente}) =>{
        const registroPaciente = new Paciente({nombrePaciente, appPaciente, apmPaciente, fecNacPaciente, sexoPaciente, edadPaciente, telPaciente})
        const newPaciente = await this.PacienteRepository.registrarPaciente(registroPaciente)
        if(newPaciente){
            return newPaciente
        } else {
            return null
        }
    }
}
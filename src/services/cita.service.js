export class CitaService {
    constructor(CitaRepository, PacienteRepository){
        this.CitaRepository = CitaRepository;
        this.PacienteRepository = PacienteRepository
    }

    getAllCitas = async () => {
        return await this.CitaRepository.getAllCitas();
    }

    createCita = async (citaData) => {
        const { id,nobre,apellidoPaterno, apellidoMaterno, triage, edad, sexo, signosVitales } = citaData
        console.log(citaData)
        const newCita = await this.CitaRepository.createCita({id, paciente, triage, edad, sexo, signosVitales});
        return newCita;
    }

    getCitaById = async (id) => {
        const cita = await this.CitaRepository.getCitaById(id);
        return cita;
    }

    updateCita = async (id, citaData) => {
        const updatedCita = await this.CitaRepository.updateCita(id, citaData);
        return updatedCita;
    }
}
export class CitaService {
    constructor(CitaRepository){
        this.CitaRepository = CitaRepository;
    }

    getAllCitas = async () => {
        return await this.CitaRepository.getAllCitas();
    }

    createCita = async (citaData) => {
        const newCita = await this.CitaRepository.createCita(citaData);
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
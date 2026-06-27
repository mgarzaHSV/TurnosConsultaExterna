/** @typedef {import('../repositories/consultorio.repository').ConsultorioRepository}  ConsultorioRepository */
export class ConsultorioService {

    /**
     * 
     * @param {ConsultorioRepository} ConsultorioRepository
     */
    
    constructor(ConsultorioRepository){
        this.ConsultorioRepository = ConsultorioRepository
    }

    consultarMedicosAtencion = async () => {
        const medicos = await this.ConsultorioRepository.getAllMedicosAtencion()
        return medicos
    }
}
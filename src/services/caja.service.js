/** @typedef {import('../repositories/caja.repository.js').CajaRepository} CajaRepository */
/** @typedef {import('../repositories/cita.repositoy.js').CitaRepository} CitaRepository */
export class CajaService{
    /**
     * 
     * @param {CajaRepository} CajaRepository 
     * @param {CitaRepository} CitaRepository
     */
    constructor(CajaRepository, CitaRepository){
        this.CajaRepository = CajaRepository;
        this.CitaRepository = CitaRepository
    }

    consultarTurnos = async () =>{
        const dataCitasPorCobrar = this.CitaRepository.getCitasPendientesCobro()
        return dataCitasPorCobrar
    }
}
/** @typedef {import('../services/caja.service.js').CajaService} CajaService */

export class CajaController {
    /**
     * 
     * @param {CajaService} CajaService 
     */
    constructor(CajaService){
        this.CajaService = CajaService;
    }

    /**
     * 
     * @param {*} req Petición html del navegador
     * @param {*} res Respuesta html hacia el navegador
     */
    cajaPage = async (req, res) =>{
        const data = await this.CajaService.consultarTurnos()
        res.render('caja',{
            user: req.session.user.nombre,
            data : data
        })
    }
}
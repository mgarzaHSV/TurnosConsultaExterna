/** @typedef {import('../services/recepcion.service.js').RecepcionService} RecepcionService */
/** @typedef {import('../services/cita.service.js').CitaService} CitaService */
/** @typedef {import('../services/consultorio.service.js').ConsultorioService} ConsultorioService */

export class RecepcionController {
    /**
     * @param {RecepcionService} RecepcionService
     * @param {CitaService} CitaService
     * 
     */
    constructor (RecepcionService, CitaService, ConsultorioService){
        this.RecepcionService = RecepcionService;
        this.ConsultorioService = ConsultorioService

        /** @type {CitaService} */
        this.CitaService = CitaService;
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    getHTMLDashboard = async ( req, res ) =>{
        const user = req.session.user;
        if (!user) {
            return res.redirect('/login');
        }
        const data = await this.CitaService.getAllCitas()
        const consultorio = await this.ConsultorioService.consultarMedicosAtencion()
        res.render('recepcion', {user: req.session.user.nombre ,turnos: data, consultorios: consultorio});
    }
}
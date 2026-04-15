/** @typedef {import('../services/recepcion.service.js').RecepcionService} RecepcionService */
/** @typedef {import('../services/cita.service.js').CitaService} CitaService */

export class RecepcionController {
    /**
     * @param {RecepcionService} RecepcionService
     * @param {CitaService} CitaService
     */
    constructor (RecepcionService, CitaService){
        this.RecepcionService = RecepcionService;

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
        res.render('recepcion', {user: req.session.user.nombre ,turnos: data});
    }
}
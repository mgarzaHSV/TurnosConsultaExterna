/** @typedef {import('../services/recepcion.service.js').RecepcionService} RecepcionService */
/** @typedef {import('../services/turno.service.js').TurnoService} TurnoService */


export class RecepcionController {
    /**
     * @param {RecepcionService} RecepcionService
     * @param {TurnoService} TurnoService
     */
    constructor (RecepcionService, TurnoService){
        this.RecepcionService = RecepcionService;
        this.TurnoService = TurnoService;
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
        const data = await this.TurnoService.consultarTurnosGeneradosActivos()
        res.render('recepcion', {user: req.session.user.nombre ,turnos: data});
    }
}
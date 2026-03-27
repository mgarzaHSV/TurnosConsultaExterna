export class RecepcionController {
    constructor (RecepcionService, CitaService){
        this.RecepcionService = RecepcionService;
        this.CitaService = CitaService;
    }

    getHTMLDashboard = async ( req, res ) =>{
        const user = req.session.user;
        if (!user) {
            return res.redirect('/login');
        }
        const data = await this.CitaService.getAllCitas()
        res.render('recepcion', {user ,turnos: data});
    }
}
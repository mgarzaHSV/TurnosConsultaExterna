/** @typedef {import('../services/turno.service.js').TurnoService} TurnoService */

export class TurnoController {

    /**
     * 
     * @param {TurnoService} TurnoService 
     */
    constructor (TurnoService){
        this.TurnoService = TurnoService
    }


    getTurnos = async (req, res) =>{
        const data = await this.TurnoService.consultaTurnos()
        res.render('turno',{
            user: req.session.user.nombre,
            data
        })
    }

    getTodosTurnosActivos = async (req, res ) => {
        const data = await this.TurnoService.consultaTurnos()
        res.json(data)
    }
}
/** @typedef {import('../services/turno.service.js').TurnoService} TurnoService */

export class TurnoController {

    /**
     * 
     * @param {TurnoService} TurnoService 
     */
    constructor (TurnoService){
        this.TurnoService = TurnoService
    }

    getTurnosRegistradosActivos = async( req, res ) =>{
        const turnosRegistrados = await this.TurnoService.consultarTurnosRegistradosActivos()
        res.json(turnosRegistrados)
    }


    getTurnos = async (req, res) =>{
        const data = await this.TurnoService.consultaTurnos()
        res.render('turno',{
            data
        })
    }

    getTodosTurnosActivos = async (req, res ) => {
        const data = await this.TurnoService.consultaTurnos()
        res.json(data)
    }
}
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
            turnos : data
        })
    }

    registrarPago = async (req, res ) =>{
        const { turno, estatus, idCita } = req.body
        const usuario = req.session.user.username
        try {
            await this.CajaService.registrarPago({usuario,estatus, turno, idCita })
            res.status(200).json({ success: true, message: 'Estatus actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar estatus:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar estatus' });
        }
    }
}
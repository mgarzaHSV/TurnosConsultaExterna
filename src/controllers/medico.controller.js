/** @typedef {import('../services/medico.service.js').MedicoService} MedicoService */
export class MedicoController {
    /**
     * 
     * @param {MedicoService} MedicoService 
     */
    constructor(MedicoService){
        this.MedicoService = MedicoService
    }


    mostrarPaginaPrincipal = async (req, res ) => {
        res.render('medico',{
            user: req.session.user.nombre
        })
    }

    obtenerCitasPorAsignar = async (req, res ) => {
        const data = await this.MedicoService.consultarCitasSinAtender()
        res.json(data)
    }

    asignarMedicoPaciente = async ( req , res ) => {
        const userName = req.session.user.username
        const { idCita } = req.body
        const actualizado = await this.MedicoService.asignarMedicoPaciente({ idCita, userName })
        if(actualizado.code === 102 ){
            res.json({codigo: actualizado.code, mensaje: actualizado.message})
        }else{
            const io = req.app.get('io');
            io.emit('turno_asignado', { success: true, message: 'Estatus actualizado correctamente' });
            res.json({codigo: actualizado.code, mensaje: actualizado.message})
        }
    }

    consultarTurnosAsignados = async ( req , res ) =>{
        const userName = req.session.user.username
        const citasAtencion = await this.MedicoService.consultaTurnosActivosByUserName(userName)
        res.json(citasAtencion)
    }

    finalizarAtencion = async ( req , res ) => {
        const userName = req.session.user.username
        const { idCita } = req.body
        const actualizado = await this.MedicoService.finalizarAtencion({ idCita, userName})
        const io = req.app.get('io');
        io.emit('turno_finalizado', { success: true, mensaje: 'Estatus actualizado correctamente' });
        if(!actualizado) console.log("No se pudo actualizar")
        res.json({ success: true, data: actualizado })
    }

    regresarPacienteFila = async ( req, res ) => {
        const userName = req.session.user.username
        const { idCita } = req.body
        const regresarFila = await this.MedicoService.regresarAFila({ idCita , userName })
        if(!regresarFila) return res.json({ success: false, mensaje: "Ocurrio un error al regresar al paciente" })
        const io = req.app.get('io');
        io.emit('turno_regresado', { success: true, mensaje: 'Estatus actualizado correctamente' });
        if(!regresarFila) console.log("No se pudo actualizar")
        res.json({  success: true, mensaje: "Paciente regresado correctamente a la fila" ,data: regresarFila })
    }
}
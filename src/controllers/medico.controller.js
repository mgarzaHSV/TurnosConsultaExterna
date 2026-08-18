/** @typedef {import('../services/medico.service.js').MedicoService} MedicoService */
/** @typedef {import('../services/cita.service.js').CitaService} CitaService */
export class MedicoController {
    /**
     * 
     * @param {MedicoService} MedicoService
     * @param {CitaService} CitaService 
     */
    constructor(MedicoService, CitaService){
        this.MedicoService = MedicoService
        this.CitaService = CitaService
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
        const cita = await this.CitaService.getCitaByIdTarjeta(idCita)
        if(actualizado.code === 102 ){
            res.json({codigo: actualizado.code, mensaje: actualizado.message})
        }else{
            const io = req.app.get('io');
            io.emit('turno_asignado', { success: true, message: 'Estatus actualizado correctamente', cita });
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

    listaMedicos = async (req , res ) => {
        const medicos = await this.MedicoService.consultarListaMedicos()
        if(!medicos) return res.json({ success: false, mensaje: "Ocurrio un error al consultar la lista de medicos" })
        res.json(medicos)
    }

    registroMedicoConsultorio = async ( req , res ) => {
        const { idMedico } = req.body
        const idConsultorio = {
            "CONSULTORIO 1": 1,
            "CONSULTORIO 2": 2,
            "CONSULTORIO 3": 3
        }
        const result = await this.MedicoService.guardarMedicoConsultorioTurno(idMedico, idConsultorio[req.session.user.nombre])
        res.json({ success: true, mensaje: `Médico con ID ${idMedico} registrado en el consultorio correctamente` })
    }
}
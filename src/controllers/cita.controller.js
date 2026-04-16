/** @typedef {import('../services/cita.service.js').CitaService} CitaService */

export class CitaController {
    /**
     * 
     * @param {CitaService} CitaService 
     */
    constructor(CitaService){
        this.CitaService = CitaService;
    }

    getAllCitas = async (req, res) => {
        const citas = await this.CitaService.getAllCitas();
        res.json(citas);
    }

    createCita = async (req, res) => {
        const newCita = await this.CitaService.createCita(req.body);
        if (newCita) {
            res.status(201).json({ message: 'Cita creada exitosamente', cita: newCita });
            const io = req.app.get('io');
            io.emit('turno_creado', { success: true, message: 'Estatus actualizado correctamente' });
        } else {
            res.status(500).json({ message: 'Error al crear la cita' });
        }
    }

    getCitaById = async (req, res) => {
        const { id } = req.params;
        const cita = await this.CitaService.getCitaById(id);
        if (cita) {
            res.json(cita);
        } else {
            res.status(404).json({ message: 'Cita no encontrada' });
        }
    }
}
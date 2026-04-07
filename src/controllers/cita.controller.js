export class CitaController {
    constructor(CitaService){
        this.CitaService = CitaService;
    }

    getAllCitas = async (req, res) => {
        const citas = await this.CitaService.getAllCitas();
        res.json(citas);
    }

    createCita = async (req, res) => {
        console.log(req.body)
        // Aquí iría la lógica para crear una nueva cita en la base de datos
        const newCita = await this.CitaService.createCita(req.body);
        console.log(newCita)
        if (newCita) {
            res.status(201).json({ message: 'Cita creada exitosamente', cita: newCita });
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

    updateCita = async (req, res) => {
        const { id } = req.params;
        const { paciente, fecha, hora } = req.body;
        const updatedCita = await this.CitaService.updateCita(id, { paciente, fecha, hora });
        if (updatedCita) {
            res.json({ message: 'Cita actualizada exitosamente', cita: updatedCita });
        } else {
            res.status(404).json({ message: 'Cita no encontrada' });
        }
    }

    deleteCita = async (req, res) => {
        const { id } = req.params;
        const deleted = await this.CitaService.deleteCita(id);
        if (deleted) {
            res.json({ message: 'Cita eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'Cita no encontrada' });
        }
    }
}
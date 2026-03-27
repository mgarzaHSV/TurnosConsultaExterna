

export class CitaRepository {

    citas = [
            { id: 1, paciente: 'Juan Pérez', triage: 'Urgente', estatus: 'Generado' },
            { id: 2, paciente: 'María Gómez', triage: 'No urgente', estatus: 'Fila' },
            { id: 3, paciente: 'Carlos López', triage: 'Inmediato', estatus: 'Fila' },
            { id: 4, paciente: 'Ricardo Hernandez', triage: 'Normal', estatus: 'Atención' },
            { id: 5, paciente: 'Eunice Garza', triage: 'Muy urgente', estatus: 'Finalizado' }
        ];

    constructor() {
    }

    getAllCitas = async () => {
        return this.citas
    }

    createCita = async (citaData) => {
        const newCita = { id: this.citas.length + 1, ...citaData };
        this.citas.push(newCita);
        return newCita;
    }
    
    getCitaById = async (id) => {
        return this.citas.find(cita => cita.id === parseInt(id));
    }

    updateCita = async (id, citaData) => {
        const index = this.citas.findIndex(cita => cita.id === parseInt(id));
        if (index !== -1) {
            this.citas[index] = { ...this.citas[index], ...citaData };
            return this.citas[index];
        }
        return null;
    }
}
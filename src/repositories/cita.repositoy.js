

export class CitaRepository {

    /*
    citas = [
            { id: 1, paciente: 'Juan Pérez', triage: 'Urgente', estatus: 'Generado' },
            { id: 2, paciente: 'María Gómez', triage: 'No urgente', estatus: 'Fila' },
            { id: 3, paciente: 'Carlos López', triage: 'Inmediato', estatus: 'Fila' },
            { id: 4, paciente: 'Ricardo Hernandez', triage: 'Normal', estatus: 'Atención' },
            { id: 5, paciente: 'Eunice Garza', triage: 'Muy urgente', estatus: 'Finalizado' }
        ];
        */

    constructor(dataBase) {
        this.dataBase = dataBase
    }

    getAllCitas = async () => {
        const query = `SELECT * FROM cita WHERE estatus IN ('01')`
        try{
            const citas = await this.dataBase.consultar(query)
            console.log(citas)
            return citas
        }catch (error){
            console.error("Ocurrio un error al intentar consultar citas")
            return null 
        }
    }

    createCita = async (citaData) => {
        
        const query = `INSERT INTO CITA VALUES (
                                                'CAST(GETDATE() AS DATE)', 
                                                CAST(GETDATE() AS TIME), 
                                                NULL, 
                                                NULL,
                                                NULL,
                                                1,
                                                '01',
                                                '1',
                                                NULL,
                                                NULL,
                                                NULL,
                                                NULL,
                                                1,
                                                3,
                                                NULL,
                                                NULL,
                                                NULL)`
                                                
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
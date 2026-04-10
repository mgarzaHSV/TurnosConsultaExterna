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
        const query = `SELECT 
                                        * 
                        FROM			CITA (nolock)
                        WHERE			estatus = '01'
                        ORDER BY		manchester,fechaCreacion,horaCreacion`
        try{
            const citas = await this.dataBase.consultar(query)
            return citas
        }catch (error){
            console.error("Ocurrio un error al intentar consultar citas")
            return null 
        }
    }

    createCita = async ({pacienteGuardado, triage}) => {
        /*const query = `INSERT INTO CITA (
                                        fechaCreacion,
                                        horaCreacion,
                                        turno,
                                        estatus,
                                        manchester,
                                        idPaciente,
                                        idUsuarioCrea
                                        )
                                        OUTPUT INSERTED.idCita
        VALUES                          (
                                        CAST(GETDATE() AS DATE),
                                        CAST(GETDATE() AS TIME), 
                                        (SELECT ISNULL(MAX(turno), 0) + 1 FROM CITA WHERE CAST(fechaCreacion AS DATE) = CAST(GETDATE() AS DATE)),
                                        ${triage},
                                        '1',
                                        ${pacienteGuardado.idPaciente},
                                        3
                                        )`*/
        const query = `DECLARE @turno INT;

                    BEGIN TRAN;

                    SELECT @turno = ISNULL(MAX(turno), 0) + 1
                    FROM CITA WITH (UPDLOCK, HOLDLOCK)
                    WHERE fechaCreacion = CAST(GETDATE() AS DATE);

                    INSERT INTO CITA (
                        fechaCreacion,
                        horaCreacion,
                        turno,
                        estatus,
                        manchester,
                        idPaciente,
                        idUsuarioCrea
                    )
                    OUTPUT INSERTED.idCita
                    VALUES (
                        CAST(GETDATE() AS DATE),
                        CAST(GETDATE() AS TIME(0)),
                        @turno,
                        '01',
                        ${triage},
                        ${pacienteGuardado.idPaciente},
                        3
                    );

                    COMMIT;`
        try {
            const result = await this.dataBase.consultar(query)
            return result[0]
        } catch (error) {
            console.error("Ocurrio un error al intentar crear la cita")
            return null   
        }
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

    getCitasPendientesCobro = async ()=>{
        const query = `SELECT 
                                        *
                        FROM			CITA (nolock)
                        WHERE			estatus = '01'
                        ORDER BY		manchester,fechaCreacion,horaCreacion`
        try{
            const citas = await this.dataBase.consultar(query)
            return citas
        }catch (error){
            console.error("Ocurrio un error al intentar consultar citas")
            return null 
        }
    }

    actualizarEstatus = async ({usuario, estatusCita, idCita= {}, turno})=>{
        const query = `UPDATE CITA SET estatus = '${estatusCita}', idUsuarioCobra = 3 OUTPUT INSERTED.idCita WHERE idCita = 13`
        console.log(query)
        try {
            const resultado = await this.dataBase.consultar(query)
            if(!resultado[0]) return null
            return resultado[0]
        } catch (error) {
            console.error("Error al intentar actualizar el estatus")
        }
    }
}
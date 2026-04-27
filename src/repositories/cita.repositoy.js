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

    createCita = async ({pacienteGuardado, triage, seguimiento, noCuenta}) => {
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
                        idUsuarioCrea,
                        seguimiento,
                        noCuenta
                    )
                    OUTPUT INSERTED.idCita
                    VALUES (
                        CAST(GETDATE() AS DATE),
                        CAST(GETDATE() AS TIME(0)),
                        @turno,
                        '01',
                        ${triage},
                        ${pacienteGuardado.idPaciente},
                        3,
                        '${!seguimiento ? null:seguimiento}',
                        '${noCuenta}'
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

    getAllTurnos = async () => {
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

    getAllTurnosPagados = async () => {
        const query = `SELECT 
                                        *,
                                        DATEDIFF(SECOND, 
                                            CAST(fechaCobra AS DATETIME) + CAST(horaCobra AS DATETIME), 
                                            GETDATE()
                                        ) AS segundosTranscurridos
                        FROM			CITA (nolock)
                        WHERE			estatus = '02'
                        ORDER BY		manchester,fechaCreacion,horaCreacion
        `
        try {
            const resultado = await this.dataBase.consultar(query)
            if(!resultado) return null
            return resultado
        } catch (error) {
            console.error("Error al intentar actualizar el estatus")
        }
    }

    pagarTurnoPaciente = async ({usuario, estatusCita, idCita })=>{
        const query = `UPDATE CITA SET estatus = '${estatusCita}',fechaCobra = GETDATE(), horaCobra = CAST(GETDATE() AS TIME) ,   idUsuarioCobra = (SELECT idUsuario FROM USUARIO WHERE nombreUsuario = '${usuario}') OUTPUT INSERTED.idCita WHERE idCita = ${idCita}`
        try {
            const resultado = await this.dataBase.consultar(query)
            if(!resultado[0]) return null
            return resultado[0]
        } catch (error) {
            console.error("Error al intentar actualizar el estatus")
        }
    }

    asignarMedicoPaciente = async ( { userName, idCita } ) => {
        const query = `UPDATE CITA SET horaAsignacion =  CAST(GETDATE() AS TIME), estatus = '03', consultorio = (SELECT nombre FROM USUARIO WHERE nombreUsuario ='${userName}'), idUsuarioAsigna = (SELECT idUsuario FROM USUARIO WHERE nombreUsuario ='${userName}')  OUTPUT INSERTED.idCita  WHERE idCita = ${idCita}`
        try{
            const resultado = await this.dataBase.consultar(query)
            if(!resultado[0]) return null
            return resultado[0]
        }catch(error){
            console.log("Error al intentar asignar a un medico")
            return null
        }
    }

    consultarTurnosActivosByUserName = async ( userName ) =>{
        const query = `SELECT			* 
                        FROM			CITA 
                        WHERE			idUsuarioAsigna = (SELECT 
                                                                        idUsuario 
                                                            FROM		USUARIO 
                                                            WHERE		nombreUsuario = '${userName}')
                        AND estatus = '03'`
        try {
            const resultado = await this.dataBase.consultar(query)
            if(!resultado)return null
            return resultado
        } catch (error) {
            console.error("Ocurrio un error al intentar consultar los turnos activos del medico")
            return null
        }
    }

    regresarPacienteAFila = async ( { idCita , userName }) => {
        const query = `UPDATE CITA SET idUsuarioAsigna = (SELECT idUsuario FROM USUARIO WHERE nombreUsuario ='${userName}'), fechaAsignacion = NULL, horaAsignacion = NULL, estatus = '02' OUTPUT INSERTED.idCita WHERE idCita = ${idCita}`
        try {
            const resultado = await this.dataBase.consultar(query)
            if(!resultado[0]) return null
            return resultado[0]
        } catch (error) {
            console.error("Error al intentar finalizar la atención")
            return null
        }
    }

    finalizarAtencion = async ( { idCita, userName} ) => {
        const query = `UPDATE CITA SET estatus = '04', horaCierra = CAST(GETDATE() AS TIME), idUsuarioCierra = (SELECT idUsuario FROM USUARIO WHERE nombreUsuario ='${userName}') OUTPUT INSERTED.idCita WHERE idCita = ${idCita}`
        try {
            const resultado = await this.dataBase.consultar(query)
            if(!resultado[0]) return null
            return resultado[0]
        } catch (error) {
            console.error("Error al intentar finalizar la atención")
            return null
        }
    }
}
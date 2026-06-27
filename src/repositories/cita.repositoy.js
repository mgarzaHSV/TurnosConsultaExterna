import { Rol } from "../models/Rol.js"
import { Paciente } from "../models/Paciente.js"
import { Turno } from "../models/Turno.js"
import { Usuario } from "../models/Usuario.js"

export class CitaRepository {

    constructor(dataBase) {
        this.dataBase = dataBase
    }

    getAllCitas = async () => {
        const query = `SELECT 
                                        C.idCita,
                                        C.fechaCreacion,
                                        C.horaCreacion,
                                        UCREA.idUsuario AS idUsuarioCREA,
                                        UCREA.nombreUsuario AS nombreUsuarioCREA,
                                        UCREA.nombre AS nombreCREA,
                                        UCREA.password AS passwordCREA,
                                        UCREA.idRol AS idRolCREA,
                                        RCREA.nombreRol AS nombreRolCREA,
                                        C.horaCobra,
                                        C.idUsuarioCobra AS idUsuarioCOBRA,
                                        UCOBRA.nombreUsuario AS nombreUsuarioCOBRA,
                                        UCOBRA.nombre AS nombreCOBRA,
                                        UCOBRA.password AS passwordCOBRA,
                                        UCOBRA.idRol AS idRolCOBRA,
                                        RCOBRA.nombreRol AS nombreRolCOBRA,
                                        C.horaAsignacion,
                                        C.idUsuarioAsigna AS idUsuarioASIGNA,
                                        UASIGNA.nombreUsuario AS nombreUsuarioASIGNA,
                                        UASIGNA.nombre AS nombreASIGNA,
                                        UASIGNA.password AS passwordASIGNA,
                                        UASIGNA.idRol AS idRolASIGNA,
                                        RASIGNA.nombreRol AS nombreRolASIGNA,
                                        C.horaCierra,
                                        C.idUsuarioCierra AS idUsuarioCIERRA,
                                        UCIERRA.nombreUsuario AS nombreUsuarioCIERRA,
                                        UCIERRA.nombre AS nombreCIERRA,
                                        UCIERRA.password AS passwordCIERRA,
                                        UCIERRA.idRol AS idRolCIERRA,
                                        RCIERRA.nombreRol AS nombreRolCIERRA,
                                        C.turno,
                                        C.estatus,
                                        C.manchester,
                                        C.consultorio,
                                        P.*
                        FROM			CITA  C	(nolock)
                        INNER JOIN		PACIENTE P (nolock) ON C.idPaciente = P.idPaciente
                        INNER JOIN		USUARIO UCREA (nolock) ON C.idUsuarioCrea = UCREA.idUsuario
                        INNER JOIN		ROL RCREA (nolock) ON UCREA.idRol = RCREA.idRol
                        LEFT JOIN		USUARIO UCOBRA (nolock) ON C.idUsuarioCobra = UCOBRA.idUsuario
                        LEFT JOIN		ROL RCOBRA (nolock) ON UCOBRA.idRol = RCOBRA.idRol
                        LEFT JOIN		USUARIO UASIGNA (nolock) ON C.idUsuarioAsigna = UASIGNA.idUsuario
                        LEFT JOIN		ROL RASIGNA (nolock) ON UASIGNA.idRol = RASIGNA.idRol
                        LEFT JOIN		USUARIO UCIERRA (nolock) ON C.idUsuarioCierra = UCIERRA.idUsuario
                        LEFT JOIN		ROL RCIERRA (nolock) ON UCIERRA.idRol = RCIERRA.idRol
                        WHERE			estatus = '01'
                        ORDER BY		manchester,fechaCreacion,horaCreacion`
        try{
            const resultado = await this.dataBase.consultar(query)
            const turnos = resultado.map(
                /**
                 * 
                 * @param {*} turno 
                 * @returns 
                 */
                turno =>{
                const rol = new Rol(turno.idRolCREA, turno.nombreRolCREA)
                const paciente = new Paciente(turno.idPaciente, turno.nombrePaciente, turno.appPaciente, turno.apmPaciente, turno.sexoPaciente, turno.edadPaciente)
                const usuarioCrea = Usuario.datosUsuario(turno.idUsuarioCREA, turno.nombreUsuarioCREA, turno.nombreCREA, turno.passwordCREA, rol)
                const usuarioCobra = turno.idUsuarioCOBRA ? Usuario.datosUsuario(turno.idUsuarioCOBRA, turno.nombreUsuarioCOBRA, turno.nombreCOBRA, turno.passwordCOBRA, new Rol(turno.idRolCOBRA, turno.nombreRolCOBRA)) : Usuario.usuarioVacio()
                const usuarioAsigna = turno.idUsuarioASIGNA ? Usuario.datosUsuario(turno.idUsuarioASIGNA, turno.nombreUsuarioASIGNA, turno.nombreASIGNA, turno.passwordASIGNA, new Rol(turno.idRolASIGNA, turno.nombreRolASIGNA)) : Usuario.usuarioVacio()
                const usuarioCierra = turno.idUsuarioCIERRA ? Usuario.datosUsuario(turno.idUsuarioCIERRA, turno.nombreUsuarioCIERRA, turno.nombreCIERRA, turno.passwordCIERRA, new Rol(turno.idRolCIERRA, turno.nombreRolCIERRA)) : Usuario.usuarioVacio()
                const datoTurno = new Turno(turno.idCita,
                    turno.fechaCreacion,
                    turno.horaCreacion,
                    turno.horaCobra,
                    turno.horaCierra,
                    turno.horaAsignacion,
                    turno.turno,
                    turno.estatus,
                    turno.manchester,
                    paciente,
                    usuarioCrea,
                    usuarioCobra,
                    usuarioAsigna,
                    usuarioCierra,
                    turno.consultorio
                )
                return datoTurno
            })
            return turnos
        }catch (error){
            console.error("Ocurrio un error al intentar consultar citas" + error)
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
            console.error("Error al intentar asignar a un medico")
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
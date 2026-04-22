/** @typedef {import('../database/database.js').Database} Database */

import { Paciente } from '../models/Paciente.js'
import { Rol } from '../models/Rol.js'
import { Turno } from '../models/Turno.js'
import { Usuario } from '../models/Usuario.js'

export class TurnoRepository{

    /**
     * 
     * @param {Database} dataBase 
     */
    constructor(dataBase){
        this.dataBase = dataBase
    }

    turnosRegistradosActivos = async () =>{
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
                                P.idPaciente,
                                P.nombrePaciente,
                                P.appPaciente,
                                P.apmPaciente,
                                P.sexoPaciente,
                                P.edadPaciente
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
            return []
        }
    }

    getAllInfoTurnos = async () => {
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
                                        P.idPaciente,
										P.nombrePaciente,
										P.appPaciente,
										P.apmPaciente,
										P.sexoPaciente,
										P.edadPaciente
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
            return []
        }
    }
    

    consultarTurnoMostrar = async ()=>{
        const query = `	SELECT 
                                        * 
                        FROM CITA (NOLOCK) 
                        WHERE estatus IN ('02','03') 
                        ORDER BY horaAsignacion DESC,consultorio DESC, manchester,fechaCreacion,horaCreacion`
        try {
            const result = await this.dataBase.consultar(query)
            console.log(result)
            return result
        } catch (error) {
            console.error("Error al consultar las citas a mostrar")
            return null            
        }       
    }
}
export class CoordinacionUrgRepository {
    constructor(dataBase) {
        this.dataBase = dataBase;
    }

    getEstadisticasDashboard = async ({ fechaInicio, fechaFin, consultorio }) => {
        const filtroConsultorio = consultorio && consultorio !== 'TODOS' 
            ? `AND C.consultorio = '${consultorio}'` 
            : '';

        // 1. Resumen general y tiempos promedio globales (Citas finalizadas estatus '04')
        const queryResumen = `
            SELECT 
                COUNT(*) AS totalAtenciones,
                ISNULL(AVG(
                    CASE 
                        WHEN C.horaAsignacion IS NOT NULL AND COALESCE(C.horaCobra, C.horaCreacion) IS NOT NULL
                        THEN DATEDIFF(MINUTE, COALESCE(C.horaCobra, C.horaCreacion), C.horaAsignacion)
                    END
                ), 0) AS promedioEsperaMin,
                ISNULL(AVG(
                    CASE 
                        WHEN C.horaCierra IS NOT NULL AND C.horaAsignacion IS NOT NULL
                        THEN DATEDIFF(MINUTE, C.horaAsignacion, C.horaCierra)
                    END
                ), 0) AS promedioAtencionMin
            FROM CITA C (NOLOCK)
            WHERE C.estatus = '04'
              AND C.fechaCreacion BETWEEN '${fechaInicio}' AND '${fechaFin}'
              ${filtroConsultorio};
        `;

        // 2. Desglose por Grupo Etario (Niños, Jóvenes, Adultos, Adultos Mayores)
        const queryEdades = `
            SELECT 
                CASE 
                    WHEN P.edadPaciente BETWEEN 0 AND 11 THEN 'Niños (0-11)'
                    WHEN P.edadPaciente BETWEEN 12 AND 26 THEN 'Jóvenes (12-26)'
                    WHEN P.edadPaciente BETWEEN 27 AND 59 THEN 'Adultos (27-59)'
                    ELSE 'Adultos Mayores (60+)'
                END AS grupoEtario,
                CASE 
                    WHEN P.edadPaciente BETWEEN 0 AND 11 THEN 1
                    WHEN P.edadPaciente BETWEEN 12 AND 26 THEN 2
                    WHEN P.edadPaciente BETWEEN 27 AND 59 THEN 3
                    ELSE 4
                END AS orden,
                COUNT(*) AS cantidad,
                ISNULL(AVG(
                    CASE 
                        WHEN C.horaCierra IS NOT NULL AND C.horaAsignacion IS NOT NULL
                        THEN DATEDIFF(MINUTE, C.horaAsignacion, C.horaCierra)
                    END
                ), 0) AS promedioAtencionMin
            FROM CITA C (NOLOCK)
            INNER JOIN PACIENTE P (NOLOCK) ON C.idPaciente = P.idPaciente
            WHERE C.estatus = '04'
              AND C.fechaCreacion BETWEEN '${fechaInicio}' AND '${fechaFin}'
              ${filtroConsultorio}
            GROUP BY 
                CASE 
                    WHEN P.edadPaciente BETWEEN 0 AND 11 THEN 'Niños (0-11)'
                    WHEN P.edadPaciente BETWEEN 12 AND 26 THEN 'Jóvenes (12-26)'
                    WHEN P.edadPaciente BETWEEN 27 AND 59 THEN 'Adultos (27-59)'
                    ELSE 'Adultos Mayores (60+)'
                END,
                CASE 
                    WHEN P.edadPaciente BETWEEN 0 AND 11 THEN 1
                    WHEN P.edadPaciente BETWEEN 12 AND 26 THEN 2
                    WHEN P.edadPaciente BETWEEN 27 AND 59 THEN 3
                    ELSE 4
                END
            ORDER BY orden;
        `;

        // 3. Tiempo promedio de espera por Semáforo Manchester (1 al 5)
        const queryManchester = `
            SELECT 
                C.manchester,
                COUNT(*) AS cantidad,
                ISNULL(AVG(
                    CASE 
                        WHEN C.horaAsignacion IS NOT NULL AND COALESCE(C.horaCobra, C.horaCreacion) IS NOT NULL
                        THEN DATEDIFF(MINUTE, COALESCE(C.horaCobra, C.horaCreacion), C.horaAsignacion)
                    END
                ), 0) AS promedioEsperaMin
            FROM CITA C (NOLOCK)
            WHERE C.estatus = '04'
              AND C.fechaCreacion BETWEEN '${fechaInicio}' AND '${fechaFin}'
              ${filtroConsultorio}
            GROUP BY C.manchester
            ORDER BY C.manchester;
        `;

        // 4. Tendencia diaria en el periodo seleccionado
        const queryTendencia = `
            SELECT 
                CONVERT(VARCHAR(10), C.fechaCreacion, 23) AS fecha,
                COUNT(*) AS total
            FROM CITA C (NOLOCK)
            WHERE C.estatus = '04'
              AND C.fechaCreacion BETWEEN '${fechaInicio}' AND '${fechaFin}'
              ${filtroConsultorio}
            GROUP BY C.fechaCreacion
            ORDER BY C.fechaCreacion;
        `;
        // 5. Atenciones por Sexo y Rango de Edades
        const querySexoEdades = `
            SELECT 
                CASE 
                    WHEN UPPER(LEFT(LTRIM(RTRIM(ISNULL(P.sexoPaciente, ''))), 1)) = 'M' THEN 'Masculino'
                    WHEN UPPER(LEFT(LTRIM(RTRIM(ISNULL(P.sexoPaciente, ''))), 1)) = 'F' THEN 'Femenino'
                    ELSE 'Otro / No especificado'
                END AS sexo,
                CASE 
                    WHEN P.edadPaciente BETWEEN 0 AND 11 THEN 'Niños (0-11)'
                    WHEN P.edadPaciente BETWEEN 12 AND 26 THEN 'Jóvenes (12-26)'
                    WHEN P.edadPaciente BETWEEN 27 AND 59 THEN 'Adultos (27-59)'
                    ELSE 'Adultos Mayores (60+)'
                END AS grupoEtario,
                COUNT(*) AS cantidad
            FROM CITA C (NOLOCK)
            INNER JOIN PACIENTE P (NOLOCK) ON C.idPaciente = P.idPaciente
            WHERE C.estatus = '04'
              AND C.fechaCreacion BETWEEN '${fechaInicio}' AND '${fechaFin}'
              ${filtroConsultorio}
            GROUP BY 
                CASE 
                    WHEN UPPER(LEFT(LTRIM(RTRIM(ISNULL(P.sexoPaciente, ''))), 1)) = 'M' THEN 'Masculino'
                    WHEN UPPER(LEFT(LTRIM(RTRIM(ISNULL(P.sexoPaciente, ''))), 1)) = 'F' THEN 'Femenino'
                    ELSE 'Otro / No especificado'
                END,
                CASE 
                    WHEN P.edadPaciente BETWEEN 0 AND 11 THEN 'Niños (0-11)'
                    WHEN P.edadPaciente BETWEEN 12 AND 26 THEN 'Jóvenes (12-26)'
                    WHEN P.edadPaciente BETWEEN 27 AND 59 THEN 'Adultos (27-59)'
                    ELSE 'Adultos Mayores (60+)'
                END;
        `;

        try {
            const [resumen, edades, manchester, tendencia, sexoEdades] = await Promise.all([
                this.dataBase.consultar(queryResumen),
                this.dataBase.consultar(queryEdades),
                this.dataBase.consultar(queryManchester),
                this.dataBase.consultar(queryTendencia),
                this.dataBase.consultar(querySexoEdades)
            ]);

            return {
                resumen: resumen?.[0] || { totalAtenciones: 0, promedioEsperaMin: 0, promedioAtencionMin: 0 },
                edades: edades || [],
                manchester: manchester || [],
                tendencia: tendencia || [],
                sexoEdades: sexoEdades || []
            };
        } catch (error) {
            console.error("Error al consultar estadísticas de coordinación:", error);
            return null;
        }
    };

    

    getConsultoriosActivos = async () => {
        const query = `SELECT DISTINCT consultorio FROM CITA (NOLOCK) WHERE consultorio IS NOT NULL ORDER BY consultorio`;
        try {
            return await this.dataBase.consultar(query) || [];
        } catch (error) {
            return [];
        }
    };
}
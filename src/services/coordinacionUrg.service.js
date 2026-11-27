export class CoordinacionUrgService {
    constructor(coordinacionRepository) {
        this.coordinacionRepository = coordinacionRepository;
    }

    obtenerDashboard = async ({ fechaInicio, fechaFin, consultorio }) => {
        const rawData = await this.coordinacionRepository.getEstadisticasDashboard({
            fechaInicio,
            fechaFin,
            consultorio
        });

        if (!rawData) return null;

        // Asegurar los 4 grupos etarios siempre presentes
        const gruposBase = [
            'Niños (0-11)',
            'Jóvenes (12-26)',
            'Adultos (27-59)',
            'Adultos Mayores (60+)'
        ];

        const edadesCompletas = gruposBase.map(grupo => {
            const encontrado = rawData.edades.find(e => e.grupoEtario === grupo);
            return {
                grupoEtario: grupo,
                cantidad: encontrado ? Number(encontrado.cantidad) : 0,
                promedioAtencionMin: encontrado ? Math.max(0, Number(encontrado.promedioAtencionMin)) : 0
            };
        });

        // Asegurar los 5 niveles del semáforo Manchester
        const nivelesManchester = [
            { nivel: 1, nombre: 'Rojo - Inmediato', metaMin: 0, colorHex: '#ef4444' },
            { nivel: 2, nombre: 'Naranja - Muy Urgente', metaMin: 10, colorHex: '#f97316' },
            { nivel: 3, nombre: 'Amarillo - Urgente', metaMin: 60, colorHex: '#eab308' },
            { nivel: 4, nombre: 'Verde - Estándar', metaMin: 120, colorHex: '#22c55e' },
            { nivel: 5, nombre: 'Azul - No Urgente', metaMin: 240, colorHex: '#3b82f6' }
        ];

        const manchesterCompleto = nivelesManchester.map(m => {
            const encontrado = rawData.manchester.find(item => Number(item.manchester) === m.nivel);
            const promedio = encontrado ? Math.max(0, Number(encontrado.promedioEsperaMin)) : 0;
            return {
                ...m,
                cantidad: encontrado ? Number(encontrado.cantidad) : 0,
                promedioEsperaMin: promedio,
                enMeta: m.nivel === 1 ? promedio <= 5 : promedio <= m.metaMin
            };
        });

        // Procesar matriz de Sexo por Rango de Edades
        const sexosBase = ['Masculino', 'Femenino'];
        // Si existen registros en 'Otro / No especificado', los incluimos dinámicamente
        const tieneOtro = rawData.sexoEdades?.some(item => item.sexo === 'Otro / No especificado' && Number(item.cantidad) > 0);
        if (tieneOtro) sexosBase.push('Otro / No especificado');

        const sexoPorEdad = sexosBase.map(sexo => {
            const desglose = {};
            let totalSexo = 0;

            gruposBase.forEach(grupo => {
                const encontrado = rawData.sexoEdades?.find(
                    item => item.sexo === sexo && item.grupoEtario === grupo
                );
                const cant = encontrado ? Number(encontrado.cantidad) : 0;
                desglose[grupo] = cant;
                totalSexo += cant;
            });

            return {
                sexo,
                total: totalSexo,
                desglose
            };
        });
        
        return {
            resumen: {
                totalAtenciones: Number(rawData.resumen.totalAtenciones || 0),
                promedioEsperaMin: Math.max(0, Number(rawData.resumen.promedioEsperaMin || 0)),
                promedioAtencionMin: Math.max(0, Number(rawData.resumen.promedioAtencionMin || 0))
            },
            edades: edadesCompletas,
            manchester: manchesterCompleto,
            tendencia: rawData.tendencia,
            sexoPorEdad
        };

        
    };

    obtenerConsultorios = async () => {
        return await this.coordinacionRepository.getConsultoriosActivos();
    };
}
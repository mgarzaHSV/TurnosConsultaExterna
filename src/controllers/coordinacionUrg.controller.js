import { ENV } from "../config/env.config.js";


export class CoordinacionUrgController {
    constructor(coordinacionService) {
        this.coordinacionService = coordinacionService;
    }

    renderDashboard = async (req, res) => {
        try {
            const consultorios = await this.coordinacionService.obtenerConsultorios();
            res.render('coordinacionUrg', {
                appVersion: ENV.APP_VERSION,
                user: req.session.user?.nombre || req.session.user?.nombreUsuario || 'Coordinación',
                consultorios
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el panel de coordinación');
        }
    };

    getEstadisticasApi = async (req, res) => {
        try {
            const hoy = new Date();
            const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
            const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0];

            const {
                fechaInicio = primerDiaMes,
                fechaFin = ultimoDiaMes,
                consultorio = 'TODOS'
            } = req.query;

            const data = await this.coordinacionService.obtenerDashboard({
                fechaInicio,
                fechaFin,
                consultorio
            });

            if (!data) {
                return res.status(500).json({ mensaje: 'No se pudieron obtener las estadísticas' });
            }

            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    };
}
import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/Authentication.js';

export const coordinacionUrgRouter = (coordinacionController) => {
    const router = Router();

    router.get(
        '/coordinacion',
        requireAuth,
        requireRole(['Coordinacion Urgencias', 'Administrador']),
        coordinacionController.renderDashboard
    );

    router.get(
        '/coordinacion/api/estadisticas',
        requireAuth,
        requireRole(['Coordinacion Urgencias', 'Administrador']),
        coordinacionController.getEstadisticasApi
    );

    return router;
};
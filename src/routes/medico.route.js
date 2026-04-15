/** @typedef {import('../controllers/medico.controller.js').MedicoController} MedicoController */
import express from "express";
import { requireAuth, requireRole } from "../middlewares/Authentication.js";

/**
 * 
 * @param {MedicoController} MedicoController 
 */
export const medicoRouter = (MedicoController) => {
    const router = express.Router();

    router.get('/medico' ,requireAuth,requireRole(['Medico','Administrador']), MedicoController.mostrarPaginaPrincipal)

    router.get('/api/citas', MedicoController.obtenerCitasPorAsignar)

    router.post('/api/medico/asignar', MedicoController.asignarMedicoPaciente)

    router.get('/api/citas/atention', MedicoController.consultarTurnosAsignados)

    router.post('/api/medico/finalizar', MedicoController.finalizarAtencion)

    return router;
}
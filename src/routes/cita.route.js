/** @typedef {import('../controllers/cita.controller.js').CitaController} CitaController */

import express from 'express';

/**
 * 
 * @param {CitaController} citaController 
 * @returns 
 */
export const citaRoute = (citaController) =>{
    const router = express.Router();

    router.get('/citas', citaController.getAllCitas);

    router.post('/citas', citaController.createCita);

    router.get('/citas/:id', citaController.getCitaById);

    return router;
}
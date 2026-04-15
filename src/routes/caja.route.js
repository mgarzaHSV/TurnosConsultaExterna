import express from 'express';
import { requireAuth, requireRole } from '../middlewares/Authentication.js';

/** @typedef {import('../controllers/caja.controller.js').CajaController} CajaController */

/**
 * 
 * @param {CajaController} CajaController 
 */
export const cajaRouter = (CajaController)=>{
    const router = express.Router();

    router.get('/caja',requireAuth,
    requireRole(['Caja','Administrador']), CajaController.cajaPage);

    router.post('/caja/update-cita-estatus',CajaController.registrarPago)

    return router
}
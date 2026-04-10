import express from 'express';

/** @typedef {import('../controllers/caja.controller.js').CajaController} CajaController */

/**
 * 
 * @param {CajaController} CajaController 
 */
export const cajaRouter = (CajaController)=>{
    const router = express.Router();

    router.get('/caja', CajaController.cajaPage);

    router.post('/caja/update-cita-estatus',CajaController.registrarPago)

    return router
}
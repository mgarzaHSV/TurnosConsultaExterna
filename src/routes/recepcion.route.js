import express from 'express';
import { requireAuth, requireRole } from '../middlewares/Authentication.js';

/** @typedef {import('../controllers/recepcion.controller.js').RecepcionController} RecepcionController */

/**
 * 
 * @param {RecepcionController} RecepcionController 
 * @returns 
 */
export const recepcionRouter = ( RecepcionController )=>{
    const routerRecepcion = express.Router();

    routerRecepcion.get('/recepcion',requireAuth, requireRole(['Recepcion','Administrador']), RecepcionController.getHTMLDashboard)
    
    return routerRecepcion;
}
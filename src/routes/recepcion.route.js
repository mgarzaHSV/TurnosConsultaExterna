import express from 'express';
import { requireAuth, requireRole } from '../middlewares/Authentication.js';

export const recepcionRouter = ( RecepcionController )=>{
    const routerRecepcion = express.Router();

    routerRecepcion.get('/recepcion',requireAuth, requireRole(['Recepcion','Administrador']), RecepcionController.getHTMLDashboard)
    
    return routerRecepcion;
}
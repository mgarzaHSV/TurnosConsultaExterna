import express from 'express';

export const recepcionRouter = ( RecepcionController )=>{
    const routerRecepcion = express.Router();

    routerRecepcion.get('/recepcion', RecepcionController.getHTMLDashboard)
    
    return routerRecepcion;
}
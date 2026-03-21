import { Router } from 'express';
import { consultarRecepcion } from '../controllers/recepcion.controller.js';
const routerRecepcion = Router();


/**
 * Rutas que las recepciones van a manejar
 */

routerRecepcion.get('/recepcion', consultarRecepcion)
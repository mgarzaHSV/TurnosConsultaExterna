import route from 'express'
import { requireAuth, requireRole } from '../middlewares/Authentication.js'

/** @typedef {import('../controllers/turno.controller.js').TurnoController} TurnoController*/


/**
 * 
 * @param {TurnoController} TurnoController 
 * @returns Router para controlar las rutas del turno
 */
export const turnoRouter = (TurnoController)=>{
    const router = route.Router()
    
    router.get('/turnos',TurnoController.getTurnos)

    router.get('/api/turnos',TurnoController.getTodosTurnosActivos)

    return router
}
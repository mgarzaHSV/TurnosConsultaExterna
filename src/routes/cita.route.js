import express from 'express';

export const citaRoute = (citaController) =>{
    const router = express.Router();

    router.get('/citas', citaController.getAllCitas);

    router.post('/citas', citaController.createCita);

    router.get('/citas/:id', citaController.getCitaById);

    router.put('/citas/:id', citaController.updateCita);
    
    router.delete('/citas/:id', citaController.deleteCita);


    return router;
}
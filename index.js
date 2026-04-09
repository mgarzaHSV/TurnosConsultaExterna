/*  Bloque para importar las librerias para comenzar con la información */
import express from 'express';
import { ENV } from './src/config/env.config.js';
import { AuthRouter, CajaRouter, CitaRouter, RecepcionRouter } from './provider.js';
import { configMiddleware } from './src/config/init.config.js';

const app = express(); 

configMiddleware(app)

// Rutas de la aplicación
app.use(AuthRouter)
app.use(RecepcionRouter)
app.use(CitaRouter)
app.use(CajaRouter)


/**
 * Middleare para gestionar las peticiones de ruta que no se encuentrar y mostrar pagina de error 404
 */
app.use((req, res, next) => {
    res.status(404).send('404 Not Found - La página que buscas no existe.');
});


// Inicializar servidor en el puerto definido en el archivo de configuración
app.listen(ENV.PORT);
console.log("Servidor corrriendo en puerto", ENV.PORT)
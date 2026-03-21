/*  Bloque para importar las librerias para comenzar con la información */
import express from 'express';
import { ENV } from './src/config/env.config.js';
import { MainRouter } from './provider.js';

const app = express(); 
app.use(express.static(ENV.PUBLIC));

// Configuración de vistas
app.set('views', ENV.VIEWS);
app.set('view engine', 'ejs');


/**
 * Middleare para gestionar las peticiones con body en formato JSON y URL encoded
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(MainRouter) // Rutas principales de la aplicación


/**
 * Middleare para gestionar las peticiones de ruta que no se encuentrar y mostrar pagina de error 404
 */
app.use((req, res, next) => {
    res.status(404).send('404 Not Found - La página que buscas no existe.');
});


// Inicializar servidor en el puerto definido en el archivo de configuración
app.listen(ENV.PORT);
console.log("Servidor corrriendo en puerto", ENV.PORT)
/*  Bloque para importar las librerias para comenzar con la información */
import express from 'express';
import dotenv from 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';


// Agregar todas las intancias de las clases
const db = new 


// --- Configuración para ESM (Reemplazo de __dirname) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); 

// Ahora ya puedes usar path.join sin errores
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Configuración de vistas
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

/**
 * Middleare para gestionar las peticiones a la ruta principal
 */
app.get('/', (req, res) => {
    res.render('cita', { title: 'Página Principal' });
});


/* Middleware */
/**
 * Middleare para gestionar las peticiones de ruta que no se encuentrar y mostrar pagina de error 404
 */
app.use((req, res, next) => {
    res.status(404).send('404 Not Found - La página que buscas no existe.');
});


/**
 * Middleare para gestionar las peticiones con body en formato JSON y URL encoded
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * Agregar los routers para poder gestionar las peticiones de las rutas
 */



// Inicializar servidor en el puerto 3000
app.listen(process.env.PORT);
console.log("Servidor corrriendo en puerto ", process.env.PORT)
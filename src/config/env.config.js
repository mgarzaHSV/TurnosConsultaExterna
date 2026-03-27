import 'dotenv/config';
import path from 'path';

// --- Configuración para ESM (Reemplazo de __dirname) ---
//const __filename = fileURLToPath(import.meta.url);
const __filename = path.join(process.cwd(),'src','index.js');
const __dirname = path.dirname(__filename);
const rutaViews = path.join(__dirname, 'views');
const rutaPublic = path.join(__dirname, 'public');

export const ENV = {
    DB_URL: process.env.DB_URL,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    PORT: process.env.PORT || 3000,
    VIEWS:rutaViews,
    PUBLIC:rutaPublic,
    SESSION_SECRET: process.env.SESSION_SECRET,
    JWT_SECRET: process.env.JWT_SECRET_KEY
}
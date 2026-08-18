import express from 'express';
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { ENV } from './env.config.js';
import cors from 'cors';


export const configMiddleware = (app) =>{

  app.use(cors());

  app.use(express.static(ENV.PUBLIC));
  
  // Configuración de vistas
  app.set('views', ENV.VIEWS);
  app.set('view engine', 'ejs');
    
    /**
     * Middleare para gestionar las peticiones con body en formato JSON y URL encoded
    */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    
    /* Verificar si existen un usuario con el tocken */
    app.use((req, res, next) => {
      const token = req.cookies.access_token;
      req.session = { user: null };
    
      try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.session.user = data;
      } catch {}
      next();
    });
    
}
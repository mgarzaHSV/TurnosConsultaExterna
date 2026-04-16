import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { ENV } from './src/config/env.config.js';
import { AuthRouter, CajaRouter, CitaRouter, MedicoRouter, RecepcionRouter, TurnoRouter } from './provider.js';
import { configMiddleware } from './src/config/init.config.js';

const app = express(); 

configMiddleware(app);

// Rutas
app.use(AuthRouter);
app.use(RecepcionRouter);
app.use(CitaRouter);
app.use(CajaRouter);
app.use(TurnoRouter);
app.use(MedicoRouter);

// 404
app.use((req, res) => {
    res.status(404).send('404 Not Found - La página que buscas no existe.');
});

// 🔥 Socket setup
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
});

// iniciar servidor
server.listen(ENV.PORT, () => {
  console.log("Servidor corriendo en puerto", ENV.PORT);
});
import { AuthController } from "./src/controllers/auth.controller.js";
import { CitaController } from "./src/controllers/cita.controller.js";
import { RecepcionController } from "./src/controllers/recepcion.controller.js";
import { AuthRepository } from "./src/repositories/auth.repository.js";
import { CitaRepository } from "./src/repositories/cita.repositoy.js";
import { RecepcionRepository } from "./src/repositories/recepcion.repository.js";
import { authRouter } from "./src/routes/auth.route.js";
import { citaRoute } from "./src/routes/cita.route.js";
import { recepcionRouter } from "./src/routes/recepcion.route.js";
import { AuthService } from "./src/services/auth.service.js";
import { CitaService } from "./src/services/cita.service.js";
import { RecepcionService } from "./src/services/recepcion.service.js";


// Intancias de repositorios
const recepcionRepository = new RecepcionRepository()
const authRepository = new AuthRepository()
const citaRepository = new CitaRepository()

// Instancias de servicios
const authService = new AuthService(authRepository)
const recepcionService = new RecepcionService(recepcionRepository)
const citaService = new CitaService(citaRepository)

// Instancias de controladores
const authController = new AuthController(authService)
const recepcionController = new RecepcionController(recepcionService, citaService)
const citaController = new CitaController(citaService)

// Instancias de routers
export const AuthRouter = authRouter(authController)
export const RecepcionRouter = recepcionRouter(recepcionController)
export const CitaRouter = citaRoute(citaController)

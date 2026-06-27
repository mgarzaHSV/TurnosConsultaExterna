import { ENV } from "./src/config/env.config.js";
import { AuthController } from "./src/controllers/auth.controller.js";
import { CajaController } from "./src/controllers/caja.controller.js";
import { CitaController } from "./src/controllers/cita.controller.js";
import { MedicoController } from "./src/controllers/medico.controller.js";
import { RecepcionController } from "./src/controllers/recepcion.controller.js";
import { TurnoController } from "./src/controllers/turno.controller.js";
import { Database } from "./src/database/database.js";
import { AuthRepository } from "./src/repositories/auth.repository.js";
import { CajaRepository } from "./src/repositories/caja.repository.js";
import { CitaRepository } from "./src/repositories/cita.repositoy.js";
import { ConsultorioRepository } from "./src/repositories/consultorio.repository.js";
import { MedicoRepository } from "./src/repositories/medico.repository.js";
import { PacienteRepository } from "./src/repositories/paciente.repository.js";
import { RecepcionRepository } from "./src/repositories/recepcion.repository.js";
import { RolRepository } from "./src/repositories/rol.repository.js";
import { TurnoRepository } from "./src/repositories/turno.repository.js";
import { authRouter } from "./src/routes/auth.route.js";
import { cajaRouter } from "./src/routes/caja.route.js";
import { citaRoute } from "./src/routes/cita.route.js";
import { medicoRouter } from "./src/routes/medico.route.js";
import { recepcionRouter } from "./src/routes/recepcion.route.js";
import { turnoRouter } from "./src/routes/turno.route.js";
import { AuthService } from "./src/services/auth.service.js";
import { CajaService } from "./src/services/caja.service.js";
import { CitaService } from "./src/services/cita.service.js";
import { ConsultorioService } from "./src/services/consultorio.service.js";
import { MedicoService } from "./src/services/medico.service.js";
import { RecepcionService } from "./src/services/recepcion.service.js";
import { TurnoService } from "./src/services/turno.service.js";


if(!ENV.DB_URL || !ENV.DB_NAME || !ENV.DB_USER || !ENV.DB_PASSWORD) throw new Error("No se encuentran los datos relacionados al la base de datos")
const baseDatos = new Database(ENV.DB_URL,ENV.DB_NAME,ENV.DB_USER,ENV.DB_PASSWORD)


// Intancias de repositorios
const recepcionRepository = new RecepcionRepository(baseDatos)
const authRepository = new AuthRepository(baseDatos)
const citaRepository = new CitaRepository(baseDatos)
const pacienteRepository = new PacienteRepository(baseDatos)
const cajaRepository = new CajaRepository(baseDatos)
const rolRepository = new RolRepository(baseDatos)
const turnoRepository = new TurnoRepository(baseDatos)
const medicoRepository = new MedicoRepository(baseDatos)
const consultorioRepository = new ConsultorioRepository(baseDatos)

// Instancias de servicios
const authService = new AuthService(authRepository, rolRepository)
const recepcionService = new RecepcionService(recepcionRepository)
const citaService = new CitaService(citaRepository, pacienteRepository)
const cajaService = new CajaService(cajaRepository, citaRepository, pacienteRepository)
const turnoService = new TurnoService(turnoRepository, pacienteRepository)
const medicoService = new MedicoService(medicoRepository,citaRepository,pacienteRepository)
const consultorioService = new ConsultorioService(consultorioRepository)

// Instancias de controladores
const authController = new AuthController(authService)
const recepcionController = new RecepcionController(recepcionService, citaService, consultorioService)
const citaController = new CitaController(citaService)
const cajaController = new CajaController(cajaService)
const turnoController = new TurnoController(turnoService)
const medicoController = new MedicoController(medicoService)

// Instancias de routers
export const AuthRouter = authRouter(authController)
export const RecepcionRouter = recepcionRouter(recepcionController)
export const CitaRouter = citaRoute(citaController)
export const CajaRouter = cajaRouter(cajaController)
export const TurnoRouter = turnoRouter(turnoController)
export const MedicoRouter = medicoRouter(medicoController)
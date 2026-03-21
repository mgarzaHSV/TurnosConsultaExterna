import { MainController } from "./src/controllers/main.controller.js";
import { mainRouter } from "./src/routes/main.route.js";
import { MainService } from "./src/services/main.service.js";




const mainService = new MainService()


const mainController = new MainController(mainService)


export const MainRouter  = mainRouter(mainController)

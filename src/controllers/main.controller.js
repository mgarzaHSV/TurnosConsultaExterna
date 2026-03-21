export class MainController {
    constructor(MainService){
        this.MainService = MainService;
    }

    getMain = async (req, res) => {
        res.render("home");
    }
}
export class AuthController {
    
    constructor (AuthService){
        this.AuthService = AuthService;
    }

    async login(req, res){
        try {
            const { email, password } = req.body;
            const token = await this.AuthService.login(email, password);
            res.json({ token });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
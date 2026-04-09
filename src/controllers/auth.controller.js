/** @typedef {import('../services/auth.service.js').AuthService} AuthService */

export class AuthController {
    
    constructor (AuthService){
        /** @type {AuthService} */
        this.AuthService = AuthService;
    }

    loginPage = async (req, res) =>{
        if(req.session !== undefined && req.session.user !== null){
            const roles = {
                'ADMINISTRADOR': '/recepcion',
                'Recepcion': '/recepcion',
                'Caja': '/caja',
                'Medico': '/medico',
                'Pantalla': '/pantalla'
            }
            console.log(req.session.user.tipo_usr);
            return res.redirect(roles[req.session.user.tipo_usr]);
        }
        const sessionKey = await this.AuthService.createTemporalCredential();
        req.session.api_token = sessionKey;

        // Enviar la cookie al cliente con el token generado para que pueda ser leida con JavaScript
        res.cookie('X-SRF-TOKEN', sessionKey, { 
            maxAge: 300000, // 5 minutos de vida
            httpOnly: false,
            sameSite: 'strict' 
        });
        res.render('login');
    }

    verifyUserAndPassword = async (req, res) =>{
        const {username, password} = req.body;
        try {
            const result = await this.AuthService.verifyUserAndPassword(username, password, req.cookies['X-SRF-TOKEN']);
            if (result !== false)
                res
                .cookie("access_token", result, { httpOnly: true })
                .json({ status: 200, mensaje: "Login exitoso" });
            else res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" })
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: error.message });
        }
    }
}
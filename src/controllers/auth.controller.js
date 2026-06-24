/** @typedef {import('../services/auth.service.js').AuthService} AuthService */

export class AuthController {
    
    constructor (AuthService){
        /** @type {AuthService} */
        this.AuthService = AuthService;
    }

    loginPage = async (req, res) =>{
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

    logout = async (req, res) =>{
        res.clearCookie('access_token');
        res.json({ status: 200, mensaje: "Logout exitoso" });
    }

    verifyUserAndPassword = async (req, res) =>{
        const {username, password} = req.body;
            const roles = {
                1: '/recepcion',
                2: '/recepcion',
                3: '/caja',
                4: '/medico',
                5: '/pantalla'
            }
        try {
            const result = await this.AuthService.verifyUserAndPassword(username, password, req.cookies['X-SRF-TOKEN']);

            if(!result){
                return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
            }
            if(username === 'CONS1' || username === 'CONS2' || username === 'CONS3'){
                /*
                const isUserLogined = await this.AuthService.isUserLogined(conversionIdConsultorio[username])
                if (isUserLogined.idMedico !== null) {
                    return res.status(409).json({ mensaje: "El usuario ya ha iniciado sesión en otro dispositivo" });
                }*/
            }
            if (result !== false){
                const usuario = await this.AuthService.getDataOfUser(username)
                res
                .cookie("access_token", result, { httpOnly: true })
                .json({ status: 200, mensaje: "Login exitoso",otraProdieda: "Texto de prueba", href: roles[usuario.idRol]});
            }
            else res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" })
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: error.message });
        }
    }
}
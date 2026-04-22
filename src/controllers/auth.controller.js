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
            const user ={
                username: username,
                password: password
            }
            const result = await this.AuthService.verifyUserAndPassword(user, req.cookies['X-SRF-TOKEN']);
            if (result !== false){
                const usuario = await this.AuthService.getDataOfUser(username)
                if(!usuario) return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" })
                res
                .cookie("access_token", result, { httpOnly: true })
                .json({ status: 200, mensaje: "Login exitoso",otraProdieda: "Texto de prueba", href: roles[usuario.rol.idRol]});
            }
            else res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" })
        } catch (error) {
            res.status(401).json({ error: error.message });
            console.error(error);
        }
    }
}
/*app.use((req, res, next) => {
  const token = req.cookies.access_token;
  req.session = { user: null };
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.session.user = data;
  } catch {}
  next();
});*/


// middleware/auth.js
export const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};


// middleware/roles.js
export const requireRole = (allowedRoles = []) => {
    const rolesRedirect = {
        "Administrador": '/recepcion',
        "Recepcion": '/recepcion',
        "Caja": '/caja',
        "Medico": '/medico',
        "Pantalla": '/turnos'
    };

    return (req, res, next) => {
        const user = req.session.user;

        if (!user) {
            return res.redirect('/login');
        }

        // Si NO tiene el rol permitido
        if (!allowedRoles.includes(user.rol)) {
            return res.redirect(rolesRedirect[user.rol]);
        }

        next();
    };
};
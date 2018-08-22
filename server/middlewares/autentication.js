//===========================
// Verificar Token - Middleware
//===========================

const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    
    let token = req.get('Authorization');
    jwt.verify(token, process.env.CLAVE_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })
};

module.exports = verificaToken;
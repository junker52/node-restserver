const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const Usuario = require('../../models/usuario');

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            }); 
        }
        if (!usuarioDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El password no es correcto'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.CLAVE_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN});

        return res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
        
    })
})

module.exports = app;
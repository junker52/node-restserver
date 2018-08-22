const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../../models/usuario');
const verificaToken = require('../middlewares/autentication');

app.get('/', function (req, res) {
    res.json('Hello World')
})

app.get('/usuario', verificaToken, function (req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({}, 'nombre email')
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({}, (err, count) => {
                    res.json({
                        ok: true,
                        usuarios,
                        count
                    });
                })


            })
})

app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            }); 
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','img','role','estado']);
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            }); 
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioDeleted) => {
        if (err || usuarioDeleted === null) {
            return res.status(400).json({
                ok: false,
                err
            }); 
        }

        res.json({
            ok: true,
            usuario: usuarioDeleted
        })
    })
})

app.delete('/usuario/logicdelete/:id', function (req, res) {
    let id = req.params.id;
    Usuario.findById(id, null, { estado: true }, (err, usuario) => {
        if (err || usuario === null) {
            return res.status(400).json({
                ok: false,
                err
            }); 
        }
        usuario.estado = false;
        Usuario.findByIdAndUpdate(id, usuario, {new: true}, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                }); 
            }
    
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        })

    })
})

module.exports = app;
const express = require('express');
const app = express();
const _ = require('underscore');
const authenticationMiddlewares = require('../middlewares/autentication');

let Categoria = require('../../models/categoria');

app.get('/categoria', [authenticationMiddlewares.verificaToken], async(req,res) => {
    let categorias = await Categoria.find().catch((err) => {
        return res.status(500).json({
            ok: false,
            error: err
        })   
    })

    res.json({
        ok: true,
        categorias
    })
})

app.get('/categoria/:id', [authenticationMiddlewares.verificaToken], async(req, res) => {
    let id = req.params.id;
    let categoria = await Categoria.findById(id).catch((err) => {
        return res.status(500).json({
            ok: false,
            error: err
        })   
    })

    if (categoria === null) {
        return res.status(404).json({
            ok: false,
            error: {
                message: 'Resource not found'
            }
        })
    }

    return res.json({
        ok: true,
        categoria
    })  
});

app.post('/categoria', [authenticationMiddlewares.verificaToken], async(req, res) => {
    //retorna la categoria cread
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    let categoriaSaved = await categoria.save().catch((err) => {
        return res.status(500).json({
            ok: false,
            error: err
        })   
    })

    return res.json({
        ok: true,
        categoria: categoriaSaved
    })
});

app.put('/categoria/:id', [authenticationMiddlewares.verificaToken], async(req, res) => {
    let id = req.params.id;
    let descripcion = _.pick(req.body, ['descripcion']);
    let updatedCategoria =  await Categoria.findByIdAndUpdate(id, descripcion, {new: true, runValidators: true})
        .catch((error) => {
            return res.status(500).json({
                ok: false,
                error
            })
        })
    return res.json({
        ok: true,
        categoria: updatedCategoria
    })
});

app.delete('/categoria/:id', [authenticationMiddlewares.verificaToken, authenticationMiddlewares.verificaAdminRole], async(req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (error, categoriaDeleted) => {
        if (error || categoriaDeleted === null) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        return res.json({
            ok: true,
            categoria: categoriaDeleted
        })
    })
});

module.exports = app;
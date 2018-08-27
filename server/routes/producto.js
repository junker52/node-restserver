const express = require('express');
const app = express();
const authenticationMiddlewares = require('../middlewares/autentication');
const _ = require('underscore');
const Producto = require('../../models/producto');

/**
 * Listing all products with pagination
 */
app.get('/productos', [authenticationMiddlewares.verificaToken], async(req, res) => {
   let from = req.query.from || 0;
   from = Number(from);
    let to = req.query.to || 5;
    to = Number(to);

   let productos = await Producto.find()
                    .skip(from)
                    .limit(to)
                    .populate('usuario')
                    .populate('categoria')
                    .catch((error) => {
                        if (error) {
                            return res.status(500).json({
                                ok: false,
                                error
                            })
                        }
                    })
    
    return res.json({
        ok: true,
        productos
    })

   

});

app.get('/productos/:id',  [authenticationMiddlewares.verificaToken], async(req, res) => {
    let productoId = req.params.id
    let productoDB = await Producto.findById(productoId)
        .populate('usuario')
        .populate('categoria')
        .catch((error) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
        })

    return res.json({
        ok: true,
        producto: productoDB
        })
});

//Buscar productos
app.get('/productos/buscar/:termino', [authenticationMiddlewares.verificaToken], async(req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    let productos = await Producto.find({nombre: regex})
        .populate('usuario', 'categoria')
        .exec(). catch((error) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                }); 
            }
        })
    
        return res.json({
            ok: true,
            productos
        })
});


app.post('/productos', [authenticationMiddlewares.verificaToken], async(req, res) => {
    //grabar usuario
    //grabar categoria id del listado
    let userId = req.usuario._id
    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria,
        usuario: userId
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            }); 
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    })
});

app.put('/productos/:id', [authenticationMiddlewares.verificaToken], async(req, res) => {
    let productoId = req.params.id;
    let bodyToUpdate = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria'])
    let productoUpdated = await Producto.findByIdAndUpdate(productoId, bodyToUpdate,{new: true, runValidators: true})
            .catch((error) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    }); 
                }
            })
    if (!productoUpdated) {
        return res.status(404).json({
            ok: false,
            error: {
                message: 'Resource not found'
            }
        })
    }

    return res.json({
        ok: true,
        producto: productoUpdated
    })
});

app.delete('/productos/:id', [authenticationMiddlewares.verificaToken], async(req, res) => {
    //canviar disponible a falso
    let productoId = req.params.id;
    let productoUpdated = await Producto.findByIdAndUpdate(productoId, {disponible: false},{new: true, runValidators: true})
            .catch((error) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    }); 
                }
            })
    if (!productoUpdated) {
        return res.status(404).json({
            ok: false,
            error: {
                message: 'Resource not found'
            }
        })
    }

    return res.json({
        ok: true,
        producto: productoUpdated
    })
});


module.exports = app;
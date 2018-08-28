const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../../models/usuario');
const Producto = require('../../models/producto');
const fs = require('fs');
const path = require('path');

 
// centralize files to req.files...
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipoUpload = req.params.tipo;
    let id = req.params.id;
    if (!req.files)
    return res.status(400).json({
        ok: false,
        error: {
            message: 'No files found'
        }
    });

    let validTypes = ['productos','usuarios']
    if (validTypes.indexOf(tipoUpload) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: `Tipo not allowed`
            }
        })
    }

    //req.files.[input name]
    let archivo = req.files.archivo;

    //Verifying extensions
    let validExtensions = ['png', 'jpeg', 'gif', 'jpg'];
    let extensionArchivo = archivo.name.split('.')[1];

    if (validExtensions.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: `Extension ${extensionArchivo} not allowed`
            }
        })
    }

    let timestamp = Date.now();
    let nameFile = `${timestamp}-${id}.${extensionArchivo}`


    archivo.mv(`uploads/${tipoUpload}/${nameFile}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            }); 
        }

        if (tipoUpload === 'usuarios') {
            return imagenUsuario(id, res, nameFile, tipoUpload);
        } else if (tipoUpload === 'productos') {
            return imagenProductos(id,res, nameFile, tipoUpload);
        }

     
      });
});

/**
 * Cargar imagen Usuario
 * @param {Id de usuario} id 
 * @param {Response} res 
 * @param {Nombre de la imagen} nombreArchivo 
 */
let imagenUsuario = async(id, res, nombreArchivo, tipoUpload) => {
    let usuario = await Usuario.findById(id).catch((error) => {
        if (error) {
            borrarArchivo(nombreArchivo, tipoUpload)
            return res.status(500).json({
                ok: false,
                error
            }); 
        }
    })

    if (!usuario) {
        borrarArchivo(nombreArchivo, tipoUpload)
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Usuario no existe'
            }
        }); 
    }

    await borrarArchivo(usuario.img, tipoUpload)

    usuario.img = nombreArchivo;

    let usuarioSaved = await usuario.save().catch((error) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            }); 
        }
    })

    return res.json({
        ok: true,
        usuario: usuarioSaved,
        img: usuarioSaved.img
    })
        
    
}

let imagenProductos = async(id, res, nombreArchivo, tipoUpload) => {
    let producto = await Producto.findById(id).catch((error) => {
        if (error) {
            borrarArchivo(nombreArchivo, tipoUpload)
            return res.status(500).json({
                ok: false,
                error
            }); 
        }
    })

    if (!producto) {
        borrarArchivo(nombreArchivo, tipoUpload)
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Producto no existe'
            }
        }); 
    }

    await borrarArchivo(producto.img, tipoUpload)

    producto.img = nombreArchivo;

    let productoSaved = await producto.save().catch((error) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            }); 
        }
    })

    return res.json({
        ok: true,
        producto: productoSaved,
        img: productoSaved.img
    })
        
    
}


/**
 * Funcion de borrado de imagenes
 * @param {Nombre del archivo a borrar} nombreArchivo 
 * @param {Tipo de carga: Usuarios o PRoductos} tipo 
 */
let borrarArchivo = (nombreArchivo, tipo) => {
    //Si el usuario tenia un foto, la borra
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathUrl)) {
        return fs.unlinkSync(pathUrl);
    }
}

module.exports = app;


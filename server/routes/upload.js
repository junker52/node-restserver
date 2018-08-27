const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
 
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
     
        res.json({
            ok: true,
            message: 'Imagen subida OK'
        })
      });
});

module.exports = app;


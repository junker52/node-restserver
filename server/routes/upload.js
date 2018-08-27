const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
 
// centralize files to req.files...
app.use(fileUpload());

app.put('/upload', function(req, res) {
    if (!req.files)
    return res.status(400).json({
        ok: false,
        error: {
            message: 'No files found'
        }
    });

    //req.files.[input name]
    let archivo = req.files.archivo;

    //Verifying extensions
    let validExtensions = ['png', 'jpeg', 'gif', 'jpg'];
    let nombreArchivo = archivo.name.split('.')[0];
    let extensionArchivo = archivo.name.split('.')[1];
    console.log(extensionArchivo);

    if (validExtensions.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: `Extension ${extensionArchivo} not allowed`
            }
        })
    }

    let timestamp = Date.now();

    archivo.mv(`uploads/${timestamp}-${archivo.name}`, (err) => {
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


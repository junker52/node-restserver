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

    archivo.mv('uploads/filename.jpg', (err) => {
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


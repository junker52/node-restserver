const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
 
app.get('/imagen/:tipo/:img', (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = `./uploads/${tipo}/${img}`;

    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    
    let pathNoImage = path.resolve(__dirname, '../assets/no-image.png')

    if (fs.existsSync(pathUrl)) {
        res.sendFile(pathUrl)
    } else {
        res.sendFile(pathNoImage)
    }


    res.sendFile(pathNoImage);
});

module.exports = app;
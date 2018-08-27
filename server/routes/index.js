const express = require('express');
const app = express();

//===========================
// Rutas
//===========================

app.use( require('./usuario') );
app.use( require('./categoria') );
app.use( require('./login') );
app.use( require('./producto') );
app.use( require('./upload') );


module.exports = app;
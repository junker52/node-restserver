require('../config/config');
const express = require('express');
const app = express();


const mongoose = require('mongoose');


//BODY-PARSER
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//Usuario ROUTES
app.use( require('./routes/usuario') );



mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('MongoDB --> OK');
    }
});
 
app.listen(process.env.PORT, () => {
    console.log(`Listen on port ${process.env.PORT}`);    
})
const express = require('express')
const app = express()
require('../config/config');

//BODY-PARSER
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.json('Hello World')
})

app.get('/usuario', function (req, res) {
    res.json('Hello Users')
})

app.post('/usuario', function (req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            err: 'Missing field nombre'
        });
    } else {
        res.json({persona: body});
    }
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({id})
})

app.delete('/usuario', function (req, res) {
    res.json('Delete Users')
})
 
app.listen(process.env.PORT, () => {
    console.log(`Listen on port ${process.env.PORT}`);    
})
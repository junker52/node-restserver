const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'Description is required']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    }
})

module.exports = mongoose.model('Categoria', categoriaSchema);
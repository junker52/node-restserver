// ==========================
// Puerto
// ==========================

process.env.PORT = process.env.PORT || 3000

// ==========================
// Entorno
// ==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// Base de Datos
// ==========================

let urlDB = '';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.mongoUrl;
}

process.env.URLDB = urlDB;

// ==========================
// JWT
// ==========================

process.env.CADUCIDAD_TOKEN = 3600*24*30;
process.env.CLAVE_TOKEN = process.env.CLAVE_TOKEN |'secret';
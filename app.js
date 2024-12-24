const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes/routes');

const app = express();

// Configuración de vistas y middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true,
}));

// Rutas
app.use('/', router);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

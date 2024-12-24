const mysql = require('mysql2');

const cnn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', // Cambia esta contraseña si es necesario
    database: 'springdb2'
});

cnn.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

module.exports = cnn;

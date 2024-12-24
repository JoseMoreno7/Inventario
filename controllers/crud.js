const cnn = require('../database/db');
const bcrypt = require('bcrypt');

// Middleware para verificar sesión
exports.verificarSesion = (req, res, next) => {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/');
    }
};

// Verificar login
exports.verificarLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { mensaje: 'Por favor, complete todos los campos' });
    }

    try {
        cnn.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                const validPassword = await bcrypt.compare(password, result[0].password);
                if (validPassword) {
                    req.session.loggedin = true;
                    req.session.username = result[0].nombre;
                    return res.redirect('/index');
                } else {
                    return res.render('login', { mensaje: 'Contraseña incorrecta' });
                }
            } else {
                return res.render('login', { mensaje: 'Usuario no encontrado' });
            }
        });
    } catch (error) {
        console.error(error);
        res.render('login', { mensaje: 'Error inesperado, por favor intente más tarde.' });
    }
};

// Registrar usuario
exports.saveUser = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.render('registrarusuario', { mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        cnn.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.render('registrarusuario', { mensaje: 'El correo ya está registrado' });
                    }
                    throw err;
                }
                res.redirect('/');
            }
        );
    } catch (error) {
        console.error(error);
        res.render('registrarusuario', { mensaje: 'Error al registrar el usuario' });
    }
};

// Listar productos
exports.listarProducto = (req, res) => {
    cnn.query('SELECT * FROM producto', (err, result) => {
        if (err) throw err;
        res.render('listarproducto', { objproducto: result });
    });
};

// Guardar producto
exports.saveProducto = (req, res) => {
    const { nombreproducto, categoria, fecha, stock } = req.body;
    cnn.query(
        'INSERT INTO producto (nombreproducto, categoria, fecha, stock) VALUES (?, ?, ?, ?)',
        [nombreproducto, categoria, fecha, stock],
        (err, result) => {
            if (err) throw err;
            res.redirect('/listarproducto');
        }
    );
};

// Editar producto
exports.editProducto = (req, res) => {
    const id = req.params.id;
    cnn.query('SELECT * FROM producto WHERE idproducto = ?', [id], (err, result) => {
        if (err) throw err;
        res.render('editproducto', { objproducto: result[0] });
    });
};

// Actualizar producto
exports.updateProducto = (req, res) => {
    const { idproducto, nombreproducto, categoria, fecha, stock } = req.body;
    cnn.query(
        'UPDATE producto SET nombreproducto = ?, categoria = ?, fecha = ?, stock = ? WHERE idproducto = ?',
        [nombreproducto, categoria, fecha, stock, idproducto],
        (err, result) => {
            if (err) throw err;
            res.redirect('/listarproducto');
        }
    );
};

// Eliminar producto
exports.deleteProducto = (req, res) => {
    const id = req.params.id;
    cnn.query('DELETE FROM producto WHERE idproducto = ?', [id], (err, result) => {
        if (err) throw err;
        res.redirect('/listarproducto');
    });
};

// Buscar producto
exports.buscarProducto = (req, res) => {
    const { search } = req.query;
    cnn.query('SELECT * FROM producto WHERE nombreproducto LIKE ?', [`%${search}%`], (err, result) => {
        if (err) throw err;
        res.render('listarproducto', { objproducto: result });
    });
};

// Control de inventario
exports.controlInventario = (req, res) => {
    cnn.query('SELECT * FROM producto WHERE stock < 10', (err, result) => {
        if (err) throw err;
        res.render('controlinventario', { productos: result });
    });
};

// Notificación de stock bajo
exports.notificacionStock = (req, res) => {
    cnn.query('SELECT * FROM producto WHERE stock < 5', (err, result) => {
        if (err) throw err;
        res.render('notificacionstock', { productos: result });
    });
};

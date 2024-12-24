const express = require('express');
const router = express.Router();
const crud = require('../controllers/crud');

// Página principal de login
router.get('/', (req, res) => {
    res.render('login', { mensaje: '' });
});

// Verificar login
router.post('/auth/login', crud.verificarLogin);

// Menú principal
router.get('/index', crud.verificarSesion, (req, res) => {
    res.render('index');
});

// Gestión de productos
router.get('/listarproducto', crud.verificarSesion, crud.listarProducto);
router.get('/nuevoproducto', crud.verificarSesion, (req, res) => {
    res.render('nuevoproducto', { mensaje: '' });
});
router.post('/save', crud.saveProducto);
router.get('/edit/:id', crud.verificarSesion, crud.editProducto);
router.post('/update', crud.updateProducto);
router.get('/delete/:id', crud.deleteProducto);
router.get('/buscarproducto', crud.verificarSesion, crud.buscarProducto);

// Control de inventario
router.get('/controlinventario', crud.verificarSesion, crud.controlInventario);

// Notificación de stock bajo
router.get('/notificacionstock', crud.verificarSesion, crud.notificacionStock);

// Gestión de usuarios
router.get('/registrarusuario', (req, res) => {
    res.render('registrarusuario', { mensaje: '' });
});
router.post('/registrarusuario', crud.saveUser);

module.exports = router;

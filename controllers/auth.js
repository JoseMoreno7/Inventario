exports.verificarLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { mensaje: 'Por favor, completa todos los campos.' });
    }

    cnn.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const validPassword = await bcrypt.compare(password, result[0].password);
            if (validPassword) {
                req.session.loggedin = true;
                req.session.username = result[0].nombre;
                return res.redirect('/index');
            } else {
                return res.render('login', { mensaje: 'Contraseña incorrecta.' });
            }
        } else {
            return res.render('login', { mensaje: 'Usuario no encontrado.' });
        }
    });
};

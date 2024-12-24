const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/');

  jwt.verify(token, 'tu_secreto', (err, decoded) => {
    if (err) return res.redirect('/');
    req.user = decoded;
    next();
  });
}

module.exports = { verifyToken };

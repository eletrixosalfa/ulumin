const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_temporario';

module.exports = (req, res, next) => {
console.log('Middleware executado');
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Adiciona info do utilizador ao request
    next(); // Passa para a próxima função (rota)
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido.' });
  }
};
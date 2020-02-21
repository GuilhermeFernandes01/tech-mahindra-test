const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const authConfig = require('../config/auth');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const id = req.query.user_id;

  const { ultimo_login } = await User.findOne({ id });

  if (Date.now() + 10800000 - Date.parse(ultimo_login) <= 1800000) {
    return res.status(401).json({ error: 'Sessão inválida' });
  }

  if (!authHeader) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
};

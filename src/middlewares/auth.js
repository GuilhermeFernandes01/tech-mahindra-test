const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const authConfig = require('../config/auth');
const User = require('../models/User');

class Auth {
  async validateToken(headers) {
    const authHeader = headers.authorization;

    if (!authHeader) {
      throw new Error('Não autorizado');
    }

    const spliter = authHeader.split(' ');

    if (spliter.length !== 2) {
      throw new Error('Não autorizado');
    }

    const [bearer, token] = spliter;

    if (!token || bearer !== 'Bearer') {
      throw new Error('Não autorizado');
    }

    return token;
  }

  async validateAuthorization(req, res, next) {
    try {
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

      const decoded = await promisify(jwt.verify)(token, authConfig.secret);

      req.userId = decoded.id;

      return next();
    } catch (err) {
      if (err.message.includes('ultimo_login')) {
        return res
          .status(401)
          .json({ error: 'Não autorizado: usuário não encontrado' });
      }
      return res.status(401).json({ error: 'Não autorizado' });
    }
  }
}

module.exports = new Auth();

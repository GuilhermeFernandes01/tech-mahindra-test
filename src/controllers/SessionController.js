const yup = require('yup');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const authConfig = require('../config/auth');

class SessionController {
  async create(req, res) {
    try {
      const schema = yup.object().shape({
        email: yup.string().email().required(),
        senha: yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ mensagem: 'Corpo da requisição não é o esperado' });
      }

      const { email, senha } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
      }

      if (!(await bcrypt.compare(senha, user.senha))) {
        return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
      }

      const ultimo_login = new Date(Date.now());
      await User.updateOne({ email }, { ultimo_login });

      const {
        id, data_criacao, data_atualizacao,
      } = user;

      return res.status(201).json({
        id,
        data_criacao,
        data_atualizacao,
        ultimo_login,
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (err) {
      return res.status(400).json({ mensagem: 'Erro' });
    }
  }
}

module.exports = new SessionController();

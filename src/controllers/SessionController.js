const yup = require('yup');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const authConfig = require('../config/auth');

class SessionController {
  async create(req, res) {
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
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    if (!(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ mensagem: 'Senha não bate' });
    }

    const { id, name } = user;

    return res.status(201).json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new SessionController();

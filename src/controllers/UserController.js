const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const yup = require('yup');
const User = require('../models/User');
const authConfig = require('../config/auth');

module.exports = {
  async create(req, res) {
    try {
      const schema = yup.object().shape({
        nome: yup.string().required(),
        email: yup
          .string()
          .email()
          .required(),
        senha: yup.string().required(),
        telefones: yup.array().of(
          yup.object().shape({
            numero: yup.string().required(),
            ddd: yup.string().required(),
          })
        ),
      });

      if (!(await schema.isValid(req.body))) {
        throw new Error('Corpo da requisição não é o esperado');
      }

      const { nome, email, senha: senhaBase, telefones } = req.body;

      const findUser = await User.findOne({ email });

      if (findUser) {
        throw new Error('E-mail já existente');
      }

      const senha = await bcrypt.hash(senhaBase, 8);

      const {
        id,
        data_criacao,
        data_atualizacao,
        ultimo_login,
      } = await User.create({
        nome,
        email,
        senha,
        telefones,
      });

      const tokenBase = jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      const token = await bcrypt.hash(tokenBase, 8);

      await User.updateOne({ id }, { token });

      return res.status(201).json({
        id,
        data_criacao,
        data_atualizacao,
        ultimo_login,
        tokenBase,
      });
    } catch (err) {
      const { message: mensagem } = err;
      return res.status(400).json({ mensagem });
    }
  },

  async search(req, res) {
    const { user_id } = req.query;

    const {
      id,
      telefones,
      data_criacao,
      data_atualizacao,
      ultimo_login,
      nome,
      email,
    } = await User.findOne({ id: user_id });

    return res.json({
      id,
      telefones,
      data_criacao,
      data_atualizacao,
      ultimo_login,
      nome,
      email,
    });
  },
};

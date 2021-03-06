const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: uuidv4(),
  },
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  senhaBase: {
    type: String,
    virtual: true,
  },
  telefones: {
    type: [{}],
    required: true,
  },
  data_criacao: {
    type: Date,
    default: new Date(Date.now()).toISOString(),
    required: true,
  },
  data_atualizacao: {
    type: Date,
    default: new Date(Date.now()).toISOString(),
    required: true,
  },
  ultimo_login: {
    type: Date,
    default: new Date(Date.now()).toISOString(),
    required: true,
  },
  token: String,
});

// UserSchema.pre('save', async (next) => {
//   this.updateOne();
//   next();
// });

module.exports = mongoose.model('User', UserSchema);

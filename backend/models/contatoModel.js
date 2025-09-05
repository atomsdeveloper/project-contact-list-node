const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  secondname: { type: String, required: true, default: '' },
  email: { type: String, required: false, default: '' },
  tel: { type: String, required: false, default: '' },
  created: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

// Função Construtura
function Contato(body) {
  this.body = body;
  this.errors = [];
  this.success = [];
  this.contato = null;
}

Contato.prototype.register = async function () {
  this.validate();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.validate = function () {
  this.cleanUp();

  // Validar e-mail somente se ele for enviado.
  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push('E-mail inváido.');
  // Valida nome pois é obrigatório.
  if (!this.body.name) this.errors.push('Campo nome é obrigatório.');
  // Valida nome pois é obrigatório.
  if (!this.body.secondname)
    this.errors.push('Campo segundo nome é obrigatório.');
  // Pelo menos um dos contatos precisam ser enviados.
  if (!this.body.tel && !this.body.email) {
    this.errors.push('Pelo menos um dos contatos precisam ser enviados.');
  }
};

Contato.prototype.cleanUp = function () {
  // Garantindo que todos os dados recebidos sejam strings.
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  // Sobreescrevendo o objeto pegando somente os dados necessários para validação.
  this.body = {
    name: this.body.name,
    secondname: this.body.secondname,
    email: this.body.email,
    tel: this.body.tel,
  };
};

Contato.prototype.edit = async function (id) {
  if (typeof id !== 'string') {
    this.errors.push('Não foi recebido um id.');
  }
  this.validate();
  if (this.errors.length > 0) return;
  this.success = 'Contato editado com sucesso.';
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

// Método estático.
Contato.buscarId = async function (id) {
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findById({ _id: id });
  return contato;
};

Contato.buscarContatos = async function (id) {
  const contato = await ContatoModel.find().sort({ created: 1 });
  return contato;
};

Contato.delete = async function (id) {
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({ _id: id });

  return contato;
};

module.exports = Contato;

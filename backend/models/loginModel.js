const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.success = [];
    this.user = null;
  }

  async login() {
    this.validate();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push('User não existe.');
      return;
    }

    // Comparando a senha recebida com a senha hash.
    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }

    this.success.push('Você entrou no sistema.');
  }

  async register() {
    this.validate();
    if (this.errors.length > 0) return;

    if (await this.userExists()) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
    this.success.push('Usuário craido com sucesso');
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });

    if (this.user) {
      this.errors.push('Usuário já existe.');
      return true;
    }

    return false;
  }

  validate() {
    this.cleanUp();

    // Validar e-mail
    if (!validator.isEmail(this.body.email))
      this.errors.push('E-mail inváido.');
    // Validar senha
    if (this.body.password.length < 3 || this.body.password.length > 15) {
      this.errors.push('A senha precisa ter entre 3 e 15 caracteres.');
    }
  }

  cleanUp() {
    // Garantindo que todos os dados recebidos sejam strings.
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    // Sobreescrevendo o objeto pegando somente os dados necessários para validação.
    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;

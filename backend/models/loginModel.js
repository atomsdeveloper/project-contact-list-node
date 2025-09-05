const { PrismaClient } = require('@prisma/client');
const validator = require('validator');

const prisma = new PrismaClient();

const bcryptjs = require('bcryptjs');

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

    this.user = await prisma.user.findUnique({
      where: { email: this.body.email },
    });

    if (!this.user) {
      this.errors.push('Usuário não econtrado.');
      return;
    }

    // Comparando a senha recebida com a senha hash.
    const checkPasswordHash = await this.checkPassword();
    if (!checkPasswordHash) {
      this.errors.push('Dados inválidos.');
      this.user = null;
      return;
    }

    this.success.push('Você entrou no sistema.');
  }

  async checkPassword() {
    return bcryptjs.compare(this.body.password, this.user.password);
  }

  async register() {
    this.validateRegister();
    if (this.errors.length > 0) return;

    if (await this.userExists()) return;

    await this.hashPassword();

    this.user = await prisma.user.create({
      data: {
        name: this.body.name,
        email: this.body.email,
        password: this.body.password,
      },
    });
    this.success.push('Usuário craido com sucesso');
  }

  async hashPassword() {
    const hash = await bcryptjs.hash(this.body.password, 10);
    this.body.password = hash;
  }

  async userExists() {
    this.user = await prisma.user.findUnique({
      where: { email: this.body.email },
    });

    if (this.user) {
      this.errors.push('Usuário já existe.');
      return true;
    }

    return false;
  }

  validate() {
    this.cleanUp();

    if (
      !validator.isEmail(this.body.email, {
        allow_utf8_local_part: true,
      })
    ) {
      // Validar e-mail
      this.errors.push('E-mail inváido.');
    }

    // Validar senha
    if (this.body.password.length < 3 || this.body.password.length > 15) {
      this.errors.push('A senha precisa ter entre 3 e 15 caracteres.');
    }
  }

  validateRegister() {
    if (!this.body.name) {
      this.errors.push('Nome inválido.');
    }

    if (
      !validator.isEmail(this.body.email, {
        allow_utf8_local_part: true,
      })
    ) {
      // Validar e-mail
      this.errors.push('E-mail inváido.');
    }

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
      name: this.body.name,
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;

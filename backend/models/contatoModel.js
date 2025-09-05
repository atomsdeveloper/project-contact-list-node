const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const validator = require('validator');

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
  this.contato = await prisma.contact.create({
    data: this.body,
  });
};

Contato.prototype.validate = function () {
  this.cleanUp();

  // Validar e-mail somente se ele for enviado.
  if (
    this.body.email &&
    !validator.isEmail(this.body.email, {
      allow_utf8_local_part: true,
    })
  )
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

  try {
    this.contato = await prisma.contact.update({
      where: { id: Number(id) },
      data: {
        name: this.body.name,
        secondname: this.body.secondname,
        email: this.body.email,
        tel: this.body.tel,
      },
    });

    this.success = 'Contato editado com sucesso.';
  } catch (e) {
    this.errors.push('Erro ao editar contato: ' + e.message);
  }
};

// Método estático.
Contato.buscarId = async function (id) {
  if (typeof id !== 'string') return;
  const contato = await prisma.contact.findFirst({
    where: { id: Number(id) },
  });
  return contato;
};

Contato.buscarContatos = async function () {
  const contato = await prisma.contact.findMany({});
  return contato;
};

Contato.delete = async function (id) {
  if (typeof id !== 'string') return;
  const contato = await prisma.contact.delete({
    where: { id: Number(id) },
  });

  return contato;
};

module.exports = Contato;

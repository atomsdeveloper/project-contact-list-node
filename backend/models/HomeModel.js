const Contato = require('./contatoModel');

class Home {
  constructor(req) {
    this.req = req;
    this.errors = [];
    this.success = [];
    this.csrfToken = null;
    this.contatos = [];
  }

  async loadData() {
    try {
      this.csrfToken = this.req.csrfToken();
      this.contatos = await Contato.buscarContatos();
      this.success.push('Dados carregados com sucesso.');
    } catch (error) {
      this.errors.push('Erro ao carregar dados da Home.');
    }
  }
}

module.exports = Home;

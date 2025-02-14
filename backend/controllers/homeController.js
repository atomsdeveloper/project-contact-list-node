const Contato = require('../models/contatoModel');

exports.index = async function (req, res) {
  const contatos = await Contato.buscarContatos();
  if (!contatos) {
    req.flash('success', 'Cadastro efetuado com sucesso, faça o Login.');
  }
  res.status(200).json({ contatos });
};

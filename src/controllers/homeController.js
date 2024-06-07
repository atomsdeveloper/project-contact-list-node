const Contato = require('../models/contatoModel');

exports.index = async function (req, res) {
  const contatos = await Contato.buscarContatos();
  res.render('index', { contatos });
};

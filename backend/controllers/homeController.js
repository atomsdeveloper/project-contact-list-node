const Contato = require('../models/contatoModel');

exports.start = async function (req, res) {
  const contatos = await Contato.buscarContatos();
  res.status(200).json({ contatos });
};

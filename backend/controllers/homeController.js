const Contato = require('../models/contatoModel');

exports.index = async function (req, res) {
  const contatos = await Contato.buscarContatos();

  // Armazenando na sessão os resultados encontrados em contatos.
  req.session.contatos = contatos;
  res.redirect('/index');
};

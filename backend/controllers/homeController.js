const Contato = require('../models/contatoModel');

exports.index = async function (req, res) {
  const contatos = await Contato.buscarContatos();
  if (!contatos) {
    req.flash('error', 'Não há cadastros na agenda.');
  }

  // Armazenando na sessão os resultados encontrados em contatos.
  req.session.contatos = contatos;
  res.redirect('/index');
};

const Contato = require('../models/contatoModel');

exports.start = async function (req, res) {
  try {
    const contatos = await Contato.buscarContatos();
    return res.status(200).json({ contatos });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error to fecth contacts and csfrToken' });
  }
};

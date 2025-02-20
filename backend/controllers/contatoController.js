const Contato = require('../models/contatoModel');

exports.register = async function (req, res) {
  try {
    const contato = new Contato(req.body);
    await contato.register();

    if (contato.errors.length > 0) {
      return res.status(400).json({ success: false, errors: contato.errors });
    }

    res.status(201).json({
      success: true,
      message: 'Contato registrado com sucesso.',
      contato: contato.contato,
    });
    return;
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: 'Erro interno do servidor.' });
  }
};

exports.editIndex = async function (req, res) {
  if (!req.params.id)
    res.status(404).json({ message: 'Não foi recebido um id.' });

  const contato = await Contato.buscarId(req.params.id);
  if (!contato)
    res.status(404).json({ message: 'Nenhum contato foi encontrado.' });

  return res.status(200).json({ success: true, contato });
};

exports.edit = async function (req, res) {
  try {
    if (!req.params.id)
      res.status(404).json({ message: 'Não é possivel encontrar o id.' });

    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if (contato.errors.length > 0) {
      res.status(404).json({ success: false, message: contato.errors });
      return;
    }

    res.status(201).json({ errors: false, message: contato.success });
    return;
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: 'Error interno do servidor.' });
  }
};

exports.delete = async function (req, res) {
  if (!req.params.id)
    return res
      .status(404)
      .json({ message: 'O id não foi fornecido para executar esta ação.' });

  const contato = await Contato.delete(req.params.id);
  if (!contato) {
    return res.status(404).json({ message: 'Contato não encontrado.' });
  }

  return res.status(201).json({
    success: true,
    message: `Contato ${req.params.id} apagado com sucesso.`,
    deletedContact: contato,
  });
};

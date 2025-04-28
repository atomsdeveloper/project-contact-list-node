const MongoStore = require('connect-mongo');
const Login = require('../models/loginModel');

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    // caso exista erros e enviada uma mensagem com o erro especifico.
    if (login.errors.length > 0) {
      return res.status(400).json({ success: false, errors: login.errors });
    }

    // caso não exista erros retona uma mensagem de sucesso.
    return res.status(201).json({ errors: false, success: login.success });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Error 404' });
  }
};

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    // Caso exista erros e enviada uma mensagem com o erro especifico.
    if (login.errors.length > 0) {
      return res.status(400).json({ errors: login.errors, message: '' });
    }

    // Após o Login com sucesso, armazenar o usuário na sessão
    const auth = (req.session.user = {
      id: login.user._id,
      email: login.user.email,
      token: login.user.token, // Adicione o token aqui
    });
    return res.status(200).json({
      errors: false,
      success: login.success,
      user: login.user,
      auth: auth,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Error 404' });
  }
};

exports.logout = function (req, res) {
  req.session.destroy(async (err) => {
    if (err) {
      console.error('Erro ao destruir sessão:', err);
      return res.status(500).json({ message: 'Erro ao fazer logout' });
    }

    // Removendo sessão diretamente do MongoStore
    const store = MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING });
    await store.destroy(req.sessionID); // Remover esta linha

    // Remover o cookie do navegador
    res.clearCookie('connect.sid', { path: '/', httpOnly: true });
    return res.status(200).json({
      message:
        'Você deslogou do sistema, para ter acesso as ações faça login novamente.',
    });
  });
};

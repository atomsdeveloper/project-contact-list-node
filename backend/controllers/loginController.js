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
    res.status(500).json({ message: "Error 404" });
  }
};

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    // Caso exista erros e enviada uma mensagem com o erro especifico.
    if (login.errors.length > 0) {
      return res.status(400).json({ errors: login.errors })
    }

    // Após o Login com sucesso, armazenar o usuário na sessão
    req.session.user = {
      id: login.user._id,
      email: login.user.email,
      token: login.user.token, // Adicione o token aqui
    };
    return res.status(200).json({ errors: false, success: login.success, user: login.user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Error 404" });
  }
};

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect('/');
};

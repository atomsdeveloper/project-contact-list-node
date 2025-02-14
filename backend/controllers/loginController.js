const Login = require('../models/loginModel');

exports.index = function (req, res) {
  if (req.session.user) return res.status(200).json({ user: req.session.user });
  return res.status(404).json({ message: "É necessário realizar o login" });
};

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    // caso exista erros e enviada uma mensagem flash com o erro especifico.
    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('./index');
      });
      return;
    }

    req.flash('success', 'Cadastro efetuado com sucesso, faça o Login.');
    req.session.save(function () {
      return res.redirect('./index');
    });
    return;
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Error 404" });
  }
};

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    // Caso exista erros e enviada uma mensagem flash com o erro especifico.
    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('./index');
      });
      return;
    }

    req.flash('success', 'Você entrou no sistema.');
    req.session.user = login.user;
    req.session.save(function () {
      return res.redirect('back');
    });
    return;
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Error 404" });
  }
};

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect('/');
};

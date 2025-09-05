require('dotenv').config();

const Login = require('../models/loginModel');
const jwt = require('jsonwebtoken');

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
    res.status(500).json({ message: 'Error 404', error: e.message });
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

    // Generate token
    const token = jwt.sign(
      { id: login.user.id, email: login.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    // Create cookie plus token generated.
    res.cookie('LOGIN_SESSION', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1h
    });

    return res.status(200).json({
      errors: false,
      success: login.success,
      user: login.user,
      auth: token,
      csrfToken: req.csrfToken(),
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Error 404' });
  }
};

exports.logout = function (req, res) {
  res.clearCookie('LOGIN_SESSION');
  return res.status(200).json({ message: 'Logout realizado com sucesso' });
};

const Login = require('../models/loginModel');

// exports.register = async function (req, res) {
//   try {
//     const login = new Login(req.body);
//     await login.register();

//     // caso exista erros e enviada uma mensagem flash com o erro especifico.
//     if (login.errors.length > 0) {
//       req.flash('errors', login.errors);
//       req.session.save(function () {
//         return res.redirect('./index');
//       });
//       return;
//     }

//     req.flash('success', 'Cadastro efetuado com sucesso, faça o Login.');
//     req.session.save(function () {
//       return res.redirect('./index');
//     });
//     return;
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ message: "Error 404" });
//   }
// };

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    // Caso exista erros e enviada uma mensagem com o erro especifico.
    if (login.errors.length > 0) {
      return res.status(400).json({ errors: login.errors })
    }

    // Após o Login com sucesso, armazenar o usuário na sessão
    req.session.user = login.user;
    return res.status(200).json({ message: "Você entrou no sistema.", user: login.user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Error 404" });
  }
};

// exports.logout = function (req, res) {
//   req.session.destroy();
//   res.redirect('/');
// };

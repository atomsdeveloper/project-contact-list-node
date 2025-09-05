const Home = require('../models/HomeModel');

exports.start = async function (req, res) {
  const home = new Home(req);
  await home.loadData();

  if (home.errors.length > 0) {
    return res.status(500).json({
      error: true,
      messages: home.errors,
    });
  }

  return res.status(200).json({
    error: false,
    messages: home.success,
    contatos: home.contatos,
    csrfToken: home.csrfToken,
  });
};

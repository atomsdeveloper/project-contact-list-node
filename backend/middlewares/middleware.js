// Adicionando middleware para todas as rotas com as mensagens de erros ou seccess com Flash Messages
exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('erros');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if (err) {
    return res.status(404).json({ message: err })
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  if (res.headersSent) {
    return
  }
  res.locals.csrfToken = req.csrfToken(); // Disponibiliza o CSRF token para as rotas
  next();
};

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.session.save(() => res.redirect('/'));
    req.flash('errors', 'Você precisa fazer login.');
    return;
  }
  next();
};

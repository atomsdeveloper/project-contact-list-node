// Adicionando middleware para todas as rotas com as mensagens de erros ou seccess com Flash Messages
exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('erros');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if (err) {
    return res.status(404).json({ message: err });
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  if (res.headersSent) {
    return;
  }
  res.locals.csrfToken = req.csrfToken(); // Disponibiliza o CSRF token para as rotas
  next();
};

exports.corsMiddleware = (req, res, next) => {
  const allowOrigins = [
    'http://localhost:5173', // Development
    'https://project-contact-list-node-production.up.railway.app', // Produção
  ];

  const origin = req.headers.origin;

  // Verificar se o domínio de origem está na lista de permitidos
  if (origin && allowOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-CSRF-Token',
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Se for uma requisição preflight (OPTIONS), respondemos rapidamente.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
};

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.session.save(() => {
      res.json({ success: false, message: 'Você precisa fazer login.' });
    });
    return;
  }
  next();
};

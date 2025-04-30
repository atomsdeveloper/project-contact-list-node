// Adicionando middleware para todas as rotas com as mensagens de erros ou seccess com Flash Messages
exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('erros');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken(); // Disponibiliza o CSRF token para as rotas
  if (!res.locals.csrfToken) {
    res
      .status(401)
      .json({ error: true, message: 'Você precisa obter o token.' });
  }
  next();
};

exports.corsMiddleware = (req, res, next) => {
  const allowOrigins = [
    'http://localhost:5173', // Development
    'https://project-contact-list-react.vercel.app', // Produção
  ];

  const origin = req.headers.origin;

  // Verificar se o domínio de origem está na lista de permitidos
  if (origin && allowOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
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

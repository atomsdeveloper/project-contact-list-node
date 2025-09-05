// Adicionando middleware para todas as rotas com as mensagens de erros ou seccess com Flash Messages
exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('erros');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  try {
    const token = req.csrfToken(); // Disponibiliza o CSRF token para as rotas
    res.locals.csrfToken = token;
    next();

    if (!res.locals.csrfToken) {
      return res
        .status(401)
        .json({ error: true, message: 'Você precisa obter o token.' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: 'Não foi possivel buscar o token.' });
  }
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
  const csrfToken = req.headers;
  if (!req.session.cookie && !csrfToken) {
    req.session.save(() => {
      res
        .status(401)
        .json({ success: false, message: 'Você precisa fazer login.' });
    });
    return;
  }
  next();
};

require('dotenv').config();
const express = require('express');
const app = express();
// Recomendação de segurança para cabeçalhos do express.
const helmet = require('helmet');
// Cookies and Header csrfToken
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
// Sessions para cookies.
const session = require('express-session');
// Mensagems rápidas que são salvas na sessions para emitir mensagems para o cliente de erro ou sucesso.
const flash = require('connect-flash');
// Routes
const routes = require('./routes');

// Sessions serão salvas na base de dados.
const MongoStore = require('connect-mongo');
// Criando conexão com o banco de dados mongoose.
const mongoose = require('mongoose');
mongoose
  .connect(process.env.CONNECTIONSTRING, {
    writeConcern: { w: 1 },
  })
  .then(() => {
    app.locals.db = mongoose.connection;
    app.emit('pronto');
  })
  .catch((e) => console.log(e));

const {
  middlewareGlobal,
  corsMiddleware,
} = require('./middlewares/middleware');

app.use(corsMiddleware);

// app.use(helmet());

app.options('*', corsMiddleware);

app.use(cookieParser());

// Usando sessions para salvar os dados no navegador.
const sessionOptions = session({
  secret: process.env.SESSIONSECRET,
  store: MongoStore.create({
    mongoUrl: process.env.CONNECTIONSTRING,
    options: {
      writeConcern: { w: 'majority' }, // Configura o Write Concern
    },
  }),
  resave: false,
  saveUninitialized: true,
  // Duração do cookie
  cookie: {
    maxAge: 1000 * 60 * 20,
    httpOnly: true,
    sameSite: 'none', // Permite requisição cross-site
    secure: true, // Obrigatório em produção com HTTPS
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessionOptions);

// Inicializa o middleware CSRF (baseado em cookies)
app.use(csrf({ cookie: true }));

// Menssagems para serem enviadas e logo após deixarem de existir.
app.use(flash());

// Middleware Globais para segurança.
app.use(middlewareGlobal);
app.use(routes);

// Só inicia o servidor quando a promise da conexão com o banco emitir o sinal 'pronto'.
app.on('pronto', () => {
  const PORT = process.env.PORTSERVER || 8080;

  app.listen(PORT, () => {
    console.log(`Acessar http://localhost:${process.env.PORTSERVER}`);
    console.log(`Servidor executando na porta ${process.env.PORTSERVER}`);
  });
});

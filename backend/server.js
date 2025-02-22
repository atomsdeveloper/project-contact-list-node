require('dotenv').config();
const express = require('express');
const app = express();

// Sessions para cookies.
const session = require('express-session');

// Sessions serão salvas na base de dados.
const MongoStore = require('connect-mongo');
// Criando conexão com o banco de dados mongoose.
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.locals.db = mongoose.connection;
    app.emit('pronto');
  })
  .catch((e) => console.log(e));


// Mensagems rápidas que são salvas na sessions para emitir mensagems para o cliente de erro ou sucesso.
const flash = require('connect-flash');

const routes = require('./routes');

// Recomendação de segurança para cabeçalhos do express.
const helmet = require('helmet');
const csrf = require('csurf');

const { middlewareGlobal, checkCsrfError, csrfMiddleware, corsMiddleware } = require('./middlewares/middleware');

app.use(corsMiddleware);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet());

// Usando sessions para salvar os dados no navegador.
const sessionOptions = session({
  secret: process.env.SESSIONSECRET,
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  // Duração do cookie
  cookie: {
    maxAge: 1000 * 60 * 20,
    httpOnly: true
  }
});
app.use(sessionOptions);

// Menssagems para serem enviadas e logo após deixarem de existir.
app.use(flash());

// Segurança de formulário
app.use(csrf());

// Middleware Globais para segurança.
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

// Só inicia o servidor quando a promise da conexão com o banco emitir o sinal 'pronto'.
app.on('pronto', () => {
  const PORT = process.env.PORTSERVER || 8080;

  app.listen(PORT, () => {
    console.log(`Acessar http://localhost:${process.env.PORTSERVER}`);
    console.log(`Servidor executando na porta ${process.env.PORTSERVER}`);
  });
});
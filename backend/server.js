require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const helmet = require('helmet');
const csrf = require('csurf');

const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middlewares
const {
  middlewareGlobal,
  corsMiddleware,
} = require('./middlewares/middleware');

// Segurança
app.use(corsMiddleware);
app.use(helmet());
app.options('*', corsMiddleware);

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CSRF Token
app.use(csrf({ cookie: true })); // Inicializa o middleware CSRF (baseado em cookies)

// Routes
app.use(routes);

// Só inicia o servidor quando a promise da conexão com o banco emitir o sinal 'pronto'.
async function main() {
  try {
    await prisma.$connect();
    const PORT = process.env.PORTSERVER || 8080;

    app.listen(PORT, () => {
      console.log(`Acessar http://localhost:${process.env.PORTSERVER}`);
      console.log(`Servidor executando na porta ${process.env.PORTSERVER}`);
    });
  } catch (error) {
    console.log('Erro ao se conectar com o servidor.', error);
  }
}
main();

const express = require('express');
const route = express.Router();

// Controllers
const homeController = require('./controllers/homeController');
const loginController = require('./controllers/loginController');
const contatoController = require('./controllers/contatoController');

// Middlewares
const { loginRequired } = require('./middlewares/middleware');

// Rotas da home
route.get('/', homeController.start);

// Rotas de login
route.post('/register', loginController.register);
route.post('/login', loginController.login);
route.get('/logout', loginController.logout);

// Rotas de contato
route.get('/contato/index', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.register);
route.get('/contato/index/:id', loginRequired, contatoController.editIndex);
route.post('/contato/edit/:id', loginRequired, contatoController.edit);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);

module.exports = route;
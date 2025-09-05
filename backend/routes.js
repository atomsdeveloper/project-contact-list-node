const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('./controllers/homeController');
const loginController = require('./controllers/loginController');
const contatoController = require('./controllers/contatoController');

// Middlewares
const { loginRequired } = require('./middlewares/middleware');
const { csrfMiddleware } = require('./middlewares/middleware');

// Rotas da home
router.get('/', csrfMiddleware, homeController.start);

// Rotas de login
router.post('/login', loginController.login);
router.get('/logout', loginController.logout);
router.post('/register', loginRequired, loginController.register);

// // Rotas de contato
router.post('/contact/register', loginRequired, contatoController.register);
router.get('/contact/index/:id', loginRequired, contatoController.editIndex); // Busca o contato que será editado.
router.post('/contact/edit/:id', loginRequired, contatoController.edit); // Envia os dados do contato editado.
router.delete('/contact/delete/:id', loginRequired, contatoController.delete);

module.exports = router;

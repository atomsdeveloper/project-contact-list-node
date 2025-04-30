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
router.post('/register', loginController.register);
router.post('/login', loginController.login);
router.get('/logout', loginController.logout);

// // Rotas de contato
router.post('/contato/register', loginRequired, contatoController.register);
router.get('/contato/index/:id', loginRequired, contatoController.editIndex);
router.post('/contato/edit/:id', loginRequired, contatoController.edit);
router.delete('/contato/delete/:id', loginRequired, contatoController.delete);

module.exports = router;

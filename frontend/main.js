import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import './assets/css/style.css';

import Login from './modules/Login';
import Cadastro from './modules/Cadastro';

// Validações de formulários
const login = new Login('.form-login');
const register = new Login('.form-register');
login.init();
register.init();

const cadastro = new Cadastro('.form-cadastro')
cadastro.init()

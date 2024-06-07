import validator from 'validator';

export default class Login {
  constructor(classForm) {
    this.form = document.querySelector(classForm);
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validate(e);
    });
  }

  validate(e) {
    const element = e.target;
    let error = false;

    const email = element.querySelector('input[name=email]');
    const pass = element.querySelector('input[name=password]');

    if (!validator.isEmail(email.value)) {
      alert('E-mail é inválido');
      error = true;
    }

    if (pass.value.length < 3 || pass.value.length > 50) {
      alert('A senha precisa ter entre 3 e 50 caracteres');
      error = true;
    }

    if (!error) element.submit();
  }
}

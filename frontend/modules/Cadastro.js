import validator from 'validator';

export default class Cadastro {
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

    const name = element.querySelector('input[name=name]');
    const email = element.querySelector('input[name=email]');
    const tel = element.querySelector('input[name=tel]');

    if (!name.value) {
      alert('Nome é obrigatório');
      error = true;
    }

    if (!validator.isEmail(email.value)) {
      alert('E-mail é inválido');
      error = true;
    }

    if (!tel.value && !email.value) {
      alert('Pelo menos um contato precisa ser salvo.');
      error = true;
    }

    if (!error) element.submit();
  }
}

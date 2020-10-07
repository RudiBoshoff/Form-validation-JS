class FormValidator {
  constructor(form, fields) {
    this.form = form;
    this.fields = fields;
  }

  initialize() {
    this.validateOnSubmit();
    this.validateOnEntry();
  }

  validateOnSubmit() {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.fields.forEach((field) => {
        this.validateField(document.querySelector(`#${field}`));
      });
    });
  }

  validateOnEntry() {
    this.fields.forEach((field) => {
      const input = document.querySelector(`#${field}`);
      input.addEventListener("input", (event) => {
        this.validateField(input);
      });
    });
  }

  validateField(field) {
    this.checkPresence(field);
    this.checkEmail(field);
    this.checkPassword(field);
  }

  checkPresence(field) {
    if (field.value.trim() === "") {
      const fieldID = field.id[0].toUpperCase() + field.id.substring(1);
      const error = `${fieldID} cannot be blank`;
      this.setStatus(field, error, false);
    } else {
      this.setStatus(field, null, true);
    }
  }

  checkEmail(field) {
    if (field.type === "email") {
      const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (regex.test(field.value)) {
        this.setStatus(field, null, true);
      } else {
        const error = "Please enter a valid email address";
        this.setStatus(field, error, false);
      }
    }
  }

  checkPassword(field) {
    if (field.type === "password") {
      const lowerCase = /[a-z]/;
      const upperCase = /[A-Z]/;
      const numbers = /[0-9]/;
      const spaces = /\s/;
      const errors = [];

      if (!lowerCase.test(field.value))
        errors.push("Password must contain a lowercase letter");
      if (!upperCase.test(field.value))
        errors.push("Password must contain an uppercase letter");
      if (!numbers.test(field.value))
        errors.push("Password must contain a number");
      if (spaces.test(field.value))
        errors.push("Password cannot contain spaces");
      if (field.value.length < 7)
        errors.push("Password must be at least 7 characters");

      if (errors.length > 0) this.setStatus(field, errors, false);
    }
  }

  setStatus(field, errors, status) {
    status ? this.fieldValid(field) : this.fieldInvalid(field, errors);
  }

  fieldValid(field) {
    field.parentElement.querySelector(".error-icon").classList.add("hidden");
    field.parentElement
      .querySelector(".success-icon")
      .classList.remove("hidden");
    field.classList.add("success");
    field.classList.remove("error");
    field.parentElement.querySelector(".error-message").innerText = "";
  }

  fieldInvalid(field, errors) {
    field.parentElement.querySelector(".error-icon").classList.remove("hidden");
    field.parentElement.querySelector(".success-icon").classList.add("hidden");
    field.classList.add("error");
    field.classList.remove("success");

    if (Array.isArray(errors)) {
      this.displayErrorMessages(field, errors);
    } else {
      field.parentElement.querySelector(".error-message").innerText = errors;
    }
  }

  displayErrorMessages(field, errors) {
    const container = field.parentElement.querySelector(".error-message");
    errors.forEach((error) => {
      const element = document.createElement("p");
      const node = document.createTextNode(error);
      element.appendChild(node);
      container.appendChild(element);
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  const fields = ["username", "email", "password"];
  const validator = new FormValidator(form, fields);
  validator.initialize();
});

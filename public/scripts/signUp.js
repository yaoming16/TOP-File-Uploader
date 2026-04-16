import { sendFormData, addError, clearError } from "./aux.js";

const form = document.getElementById("signupForm");

const name = document.getElementById("name");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirmation = document.getElementById("passwordConfirmation");

const nameError = document.getElementById("nameError");
const lastNameError = document.getElementById("lastNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const passwordConfirmationError = document.getElementById("passwordConfirmationError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  removeAllErrors();

  const errors = await sendFormData(e, "/signup", "POST", "/login");

  if (errors) {
    for (let e of errors) {
      switch (e.path) {
        case "name":
          addError(name, nameError, e.msg);
          break;
        case "lastName":
          addError(lastName, lastNameError, e.msg);
          break;
        case "email":
          addError(email, emailError, e.msg);
          break;
        case "password":
          addError(password, passwordError, e.msg);
          addError(passwordConfirmation, passwordConfirmationError, e.msg);
          break;
        case "passwordConfirmation":
          addError(password, passwordError, e.msg);
          addError(passwordConfirmation, passwordConfirmationError, e.msg);
      }
    }
  }
});

function removeAllErrors() {
  [
    nameError,
    lastNameError,
    emailError,
    passwordError,
    passwordConfirmationError,
  ].forEach((err, index) => {
    const allInputs = [name, lastName, email, password, passwordConfirmation];
    clearError(allInputs[index], err);
  });
}
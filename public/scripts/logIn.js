import { sendFormData, addError, clearError } from "./aux.js";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearError(emailInput, emailError);
  clearError(passwordInput, passwordError);

  const errors = await sendFormData(e, "/login", "POST", "/");
  if (errors) {
    for (const e of errors) {
      if (e.path === "email" || e.msg === "Invalid email") {
        addError(emailInput, emailError, e.msg);
      }
      if (e.path === "password" || e.msg === "Invalid password") {
        addError(passwordInput, passwordError, e.msg);
      }
    }
  }
});

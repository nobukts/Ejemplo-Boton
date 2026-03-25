const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const status = document.getElementById("status");
const userPanel = document.getElementById("user-panel");
const panelName = document.getElementById("panel-name");
const panelEmail = document.getElementById("panel-email");
const panelState = document.getElementById("panel-state");
const logoutBtn = document.getElementById("logout-btn");

function showMessage(text, type) {
  status.textContent = text;
  status.className = "status " + type;
}

function showLogin() {
  userPanel.classList.add("hidden");
  tabLogin.classList.remove("hidden");
  tabRegister.classList.remove("hidden");
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  showMessage("", "");
}

function showRegister() {
  userPanel.classList.add("hidden");
  tabLogin.classList.remove("hidden");
  tabRegister.classList.remove("hidden");
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  showMessage("", "");
}

function isEmailValid(email) {
  return email.includes("@") && email.includes(".");
}

function showPanel(name, email, stateText) {
  panelName.textContent = name;
  panelEmail.textContent = email;
  panelState.textContent = stateText;

  loginForm.classList.add("hidden");
  registerForm.classList.add("hidden");
  userPanel.classList.remove("hidden");
  tabLogin.classList.add("hidden");
  tabRegister.classList.add("hidden");
  showMessage("", "");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!isEmailValid(email)) {
    showMessage("Correo invalido.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("La contrasena debe tener minimo 6 caracteres.", "error");
    return;
  }

  showPanel("Usuario", email, "Sesion iniciada");
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  const confirm = document.getElementById("register-confirm").value;

  if (name.length < 3) {
    showMessage("El nombre debe tener minimo 3 caracteres.", "error");
    return;
  }

  if (!isEmailValid(email)) {
    showMessage("Correo invalido.", "error");
    return;
  }

  if (password.length < 8) {
    showMessage("La contrasena debe tener minimo 8 caracteres.", "error");
    return;
  }

  if (password !== confirm) {
    showMessage("Las contrasenas no coinciden.", "error");
    return;
  }

  registerForm.reset();
  showPanel(name, email, "Cuenta registrada");
});

tabLogin.addEventListener("click", showLogin);
tabRegister.addEventListener("click", showRegister);
logoutBtn.addEventListener("click", showLogin);

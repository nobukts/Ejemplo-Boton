/*
  boton.js
  Caracteristicas JS/jQuery usadas:
  - $(function() {}): ejecuta el codigo cuando el DOM esta listo.
  - Cache de selectores: mejora legibilidad y evita repetir busquedas.
  - Manipulacion de clases CSS para cambiar vistas (hidden/active).
  - Validacion en cliente para login y registro.
  - Formateo y validacion de RUT antes de mostrar datos.
*/

$(function () {
  // Referencias a elementos clave de interfaz.
  // Se cachean los selectores para no buscarlos en el DOM en cada evento.
  const $tabLogin = $("#tab-login");
  const $tabRegister = $("#tab-register");
  const $loginForm = $("#login-form");
  const $registerForm = $("#register-form");
  const $status = $("#status");
  const $userPanel = $("#user-panel");
  const $panelName = $("#panel-name");
  const $panelRut = $("#panel-rut");
  const $panelEmail = $("#panel-email");
  const $panelState = $("#panel-state");
  const $logoutBtn = $("#logout-btn");

  // Utilidad de mensajeria: aplica texto y clase visual (ok/error).
  // Se centraliza el mensaje para mantener un solo punto de estilo y texto.
  function showMessage(text, type) {
    $status.text(text).attr("class", "status " + type);
  }

  // Controla que vista se muestra: login o registro.
  // Una sola funcion evita duplicar logica entre login y registro.
  function showAuthView(view) {
    const isLogin = view === "login";

    $userPanel.addClass("hidden");
    $tabLogin.removeClass("hidden").toggleClass("active", isLogin);
    $tabRegister.removeClass("hidden").toggleClass("active", !isLogin);
    $loginForm.toggleClass("hidden", !isLogin);
    $registerForm.toggleClass("hidden", isLogin);
    showMessage("", "");
  }

  // Validacion minima de correo para demostracion.
  // Validacion simple para feedback inmediato sin complejidad extra.
  function isEmailValid(email) {
    return email.includes("@") && email.includes(".");
  }

  // Formatea el RUT mientras se escribe: 12345678K -> 12.345.678-K.
  // Se formatea en vivo para guiar al usuario y reducir errores de ingreso.
  function formatRutInput(value) {
    const clean = value
      .replace(/[^0-9kK]/g, "")
      .toUpperCase()
      .slice(0, 9);

    if (clean.length <= 1) {
      return clean;
    }

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    const bodyWithDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return bodyWithDots + "-" + dv;
  }

  // Convierte cualquier entrada de RUT al formato base numero-digito.
  // Se normaliza a un formato canonico antes de validar/guardar datos.
  function normalizeRut(rut) {
    const clean = rut.replace(/[^0-9kK]/g, "").toUpperCase();

    if (clean.length < 2) {
      return clean;
    }

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    return body + "-" + dv;
  }

  // Regla simplificada de estructura de RUT: 7-8 digitos + guion + DV.
  function isRutValid(rut) {
    return /^\d{7,8}-[0-9K]$/.test(rut);
  }

  // Carga datos del usuario en el panel y oculta formularios.
  // El panel resume los datos finales y oculta pasos ya completados.
  function showPanel(name, email, stateText, rut) {
    $panelName.text("Nombre: " + name);
    $panelRut.text("RUT: " + (rut && rut !== "-" ? formatRutInput(rut) : "-"));
    $panelEmail.text("Correo: " + email);
    $panelState.text("Estado: " + stateText);

    $loginForm.addClass("hidden");
    $registerForm.addClass("hidden");
    $userPanel.removeClass("hidden");
    $tabLogin.addClass("hidden");
    $tabRegister.addClass("hidden");
    showMessage("", "");
  }

  // Evento submit del login.
  // Se evita el submit real para manejar validacion y UX en cliente.
  $loginForm.on("submit", function (event) {
    event.preventDefault();
    const email = $("#login-email").val().trim();
    const password = $("#login-password").val();

    if (!isEmailValid(email)) {
      showMessage("Correo invalido.", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("La contraseña debe tener mínimo 6 caracteres.", "error");
      return;
    }

    showPanel("Usuario", email, "Sesión iniciada", "-");
  });

  // Evento submit del registro.
  // En registro: primero se normaliza/valida, luego se confirma resultado.
  $registerForm.on("submit", function (event) {
    event.preventDefault();
    const name = $("#register-name").val().trim();
    const rutFormatted = formatRutInput($("#register-rut").val().trim());
    $("#register-rut").val(rutFormatted);
    const rut = normalizeRut(rutFormatted);
    const email = $("#register-email").val().trim();
    const password = $("#register-password").val();
    const confirm = $("#register-confirm").val();

    if (name.length < 3) {
      showMessage("El nombre debe tener mínimo 3 caracteres.", "error");
      return;
    }

    if (!isEmailValid(email)) {
      showMessage("Correo invalido.", "error");
      return;
    }

    if (!isRutValid(rut)) {
      showMessage("El RUT debe tener formato 12345678-9.", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("La contraseña debe tener mínimo 6 caracteres.", "error");
      return;
    }

    if (password !== confirm) {
      showMessage("Las contraseñas no coinciden.", "error");
      return;
    }

    $registerForm[0].reset();
    showPanel(name, email, "Cuenta registrada", rut);
  });

  // Evento input: reformatea el RUT en tiempo real.
  // Formateo por input para que el RUT siempre se vea consistente al escribir.
  $("#register-rut").on("input", function () {
    $(this).val(formatRutInput($(this).val()));
  });

  // Eventos click de navegacion y cierre de sesion.
  // Se llama directo a showAuthView para reducir funciones intermedias.
  $tabLogin.on("click", function () {
    showAuthView("login");
  });

  $tabRegister.on("click", function () {
    showAuthView("register");
  });

  $logoutBtn.on("click", function () {
    showAuthView("login");
  });
});

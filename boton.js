$(function () {
  // Referencias a elementos clave del DOM.
  // Se guardan una sola vez para evitar búsquedas repetidas en cada interacción.
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

  // Muestra mensajes de estado (error/ok) con un único punto de control.
  function showMessage(text, type) {
    $status.text(text).attr("class", "status " + type);
  }

  // Cambia entre las vistas de autenticación: login o registro.
  // También limpia mensajes y oculta el panel final si estaba visible.
  function showAuthView(view) {
    const isLogin = view === "login";

    $userPanel.addClass("hidden");
    $tabLogin.removeClass("hidden").toggleClass("active", isLogin);
    $tabRegister.removeClass("hidden").toggleClass("active", !isLogin);
    $loginForm.toggleClass("hidden", !isLogin);
    $registerForm.toggleClass("hidden", isLogin);
    showMessage("", "");
  }

  // Validación simple de email para entregar feedback inmediato.
  function isEmailValid(email) {
    return email.includes("@") && email.includes(".");
  }

  // Formatea el RUT mientras se escribe (ejemplo: 12345678K -> 12.345.678-K).
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

  // Normaliza el RUT a un formato canónico sin puntos para validar/almacenar.
  function normalizeRut(rut) {
    const clean = rut.replace(/[^0-9kK]/g, "").toUpperCase();

    if (clean.length < 2) {
      return clean;
    }

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    return body + "-" + dv;
  }

  function isRutValid(rut) {
    return /^\d{7,8}-[0-9K]$/.test(rut);
  }

  // Muestra el panel final con los datos del usuario y oculta formularios/pestañas.
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

  // Login: evita recarga de página, valida campos y muestra el panel.
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

  // Registro: formatea y valida datos antes de confirmar el alta.
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

  // Aplica formato de RUT en tiempo real para mantener una entrada consistente.
  $("#register-rut").on("input", function () {
    $(this).val(formatRutInput($(this).val()));
  });

  // Navegación entre pestañas de autenticación.
  $tabLogin.on("click", function () {
    showAuthView("login");
  });

  $tabRegister.on("click", function () {
    showAuthView("register");
  });

  // Cierre de sesión simulado: retorna a la vista de login.
  $logoutBtn.on("click", function () {
    showAuthView("login");
  });
});

# Formulario de Login y Registro - Documentación de Decisiones

Este proyecto es un ejemplo educativo de una página de autenticación (login/registro) simple en **HTML + CSS + JavaScript puro**, sin frameworks ni backend.

## 📋 Tabla de Contenidos

1. [Decisiones Arquitectónicas](#decisiones-arquitectónicas)
2. [Estructura HTML](#estructura-html)
3. [Arquitectura CSS](#arquitectura-css)
4. [Lógica JavaScript](#lógica-javascript)
5. [Flujo de Usuario](#flujo-de-usuario)
6. [Cómo Extenderlo](#cómo-extenderlo)

---

## Decisiones Arquitectónicas

### 1. **Sin Backend / Sin Frameworks**

- **Decisión**: Usar HTML + CSS + JavaScript vanilla.
- **Justificación**: Para un primer acercamiento educativo, mantener todo en frontend es más simple y transparente. No hay complejidad de servidor, librerías o build tools.
- **Implicaciones**:
  - Los datos se pierden al refrescar la página.
  - No hay persistencia real (ideal para aprender con LocalStorage después).
  - Todo corre en el navegador del usuario.

### 2. **Una Sola Página HTML**

- **Decisión**: Todo (autenticación + panel de usuario) en un archivo `main.html`.
- **Justificación**:
  - Hace que sea fácil de entender el flujo completo en un solo lugar.
  - Evita la complejidad de múltiples archivos para un ejemplo educativo.
  - El cambio de vistas se maneja con CSS (clases `.hidden`) y JS (manipulación del DOM).
- **Implicaciones**:
  - Cuando el usuario "inicia sesión", no va a otra página: simplemente se ocultan los formularios y aparece el panel.
  - Esto es más similar a una **Single Page Application (SPA)** moderna.

### 3. **Simplicidad Visual Intencional**

- **Decisión**: Estilos CSS básicos, sin librerías de diseño (Bootstrap, Tailwind, etc.).
- **Justificación**:
  - Permite entender cada propiedad CSS sin "magia" de librerías.
  - Facilita la modificación y experimentación.
  - Colores y layouts simples pero funcionales.

---

## Estructura HTML

### Organización por Secciones

```html
<main class="card">
  <h1>Mi cuenta</h1>
  <div class="tabs">...</div>
  <!-- Botones de cambio -->
  <p id="status"></p>
  <!-- Mensajes de error/éxito -->
  <form id="login-form">...</form>
  <!-- Formulario de login -->
  <form id="register-form">...</form>
  <!-- Formulario de registro -->
  <section id="user-panel">...</section>
  <!-- Panel después de autenticarse -->
</main>
```

### Decisiones Específicas

#### 1. **Uso de `<main>` y clase `.card`**

- **Por qué**: Semánticamente, `<main>` indica el contenido principal de la página.
- **La clase `.card`**: Agrupa todo en un "contenedor visual" centrado, similar a una tarjeta.
- **Beneficio**: Facilita aplicar estilos al contenedor sin afectar el resto de la página.

#### 2. **Sistema de Pestañas con Botones**

```html
<button id="tab-login" class="tab active">Iniciar sesion</button>
<button id="tab-register" class="tab">Registrarse</button>
```

- **Por qué botones y no enlaces (`<a>`)**: Los botones son más semánticos aquí (no navegan, solo cambian vistas).
- **Clase `.active`**: Marca cuál pestaña está activa (la vemos en JavaScript).
- **`type="button"`**: Explícitamente decimos que no es un submit button (evita enviar formularios accidentalmente).

#### 3. **Dos Formularios Separados**

- **Decisión**: Tener `#login-form` e `#register-form` en paralelo.
- **Alternativa rechazada**: Un solo formulario con campos condicionales (más complejo en JS).
- **Ventaja**: Cada formulario es independiente; cambiar entre ellos es tan solo mostrar/ocultar.

#### 4. **Atributos `required` en Inputs**

```html
<input id="login-email" type="email" required />
```

- **Por qué**: La validación HTML5 nativa.
- **Limitación**: Solo previene envío, no la únicamente validación en JS.
- **Decisión en JS**: Duplicamos la validación en JavaScript porque:
  - Queremos controlar exactamente qué mensaje mostrar.
  - HTML5 validation puede no funcionar igual en todos los navegadores.

#### 5. **Panel de Usuario (id="user-panel")**

```html
<section id="user-panel" class="panel hidden">
  <h2>Panel de usuario</h2>
  <p><strong>Nombre:</strong> <span id="panel-name">-</span></p>
  ...
</section>
```

- **Por qué oculto por defecto**: Está en el DOM pero invisible (clase `.hidden`).
- **Ventaja**: Cuando el usuario se autentica, simplemente mostramos esto en lugar de crear elementos nuevos dinámicamente.
- **Alternativa**: Crear el panel dinámicamente con `innerHTML` o `createElement` (más avanzado, menos educativo).

---

## Arquitectura CSS

### 1. **Estilos Globales Minimalistas**

```css
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  display: grid;
  place-items: center;
  font-family: Arial, sans-serif;
  background: #f2f4f8;
}
```

- **`box-sizing: border-box`**: Asegura que `padding` y `border` se incluyan en el ancho/alto total.
- **`display: grid + place-items: center`**: Centra el contenido en la pantalla (tanto horizontal como verticalmente).
- **Background neutro**: Color gris claro para contrastar con la tarjeta blanca.

### 2. **Clases Reutilizables**

```css
.hidden {
  display: none;
}

.active {
  background: #2563eb;
  color: #ffffff;
}
```

- **Decisión**: Clases mínimas y con propósito único.
- **Ventaja**: Fácil de entender y mucho más simple que sistemas complejos de CSS.

### 3. **Paleta de Colores Fija**

- **Primario azul (`#2563eb`)**: Para elementos activos (botón de pestaña activa, botón de envío).
- **Gris (`#cfd5e1`)**: Para bordes y elementos desactivados.
- **Verde (`#15803d`)**: Para mensajes de éxito (`.ok`).
- **Rojo (`#dc2626`)**: Para mensajes de error (`.error`).

### 4. **Sin Media Queries Complejas**

- **Nota**: Usamos `width: min(420px, 92vw)` en `.card`.
- **Por qué**: Esto es responsivo sin media queries. El contenedor es máximo 420px, pero en pantallas pequeñas toma 92% del ancho.
- **Alternativa**: Media queries tradicionales (también válida, pero menos elegante).

### 5. **Estilos Separados para `.panel`**

```css
.panel {
  border: 1px solid #cfd5e1;
  border-radius: 8px;
  background: #f8fbff;
}
```

- **Decisión**: El panel tiene un fondo ligeramente azulado para diferenciarlo visualmente.
- **Justificación**: Ayuda al usuario a entender que está en una sección diferente (post-autenticación).

---

## Lógica JavaScript

### 1. **Modelo Mental: Cuatro "Vistas"**

El código maneja 4 vistas mutuamente excluyentes:

1. **Vista de Login**: Pestaña activa, formulario visible, panel oculto.
2. **Vista de Registro**: Otra pestaña activa, otro formulario visible, panel oculto.
3. **Vista de Panel**: Ambas pestañas ocultas, formularios ocultos, panel visible.
4. Estas vistas nunca se mezclan.

### 2. **Funciones de Control de Vistas**

```javascript
function showLogin() {
  /* Mostrar login, ocultar resto */
}
function showRegister() {
  /* Mostrar registro, ocultar resto */
}
function showPanel(name, email, stateText) {
  /* Mostrar panel con datos */
}
```

- **Por qué funciones separadas**: Cada vista tiene su propia lógica.
- **Más legible** que un parámetro genérico que cambiar todo.

### 3. **Validación Deliberadamente Simple**

```javascript
function isEmailValid(email) {
  return email.includes("@") && email.includes(".");
}
```

- **Decisión**: Validación muy básica (no es un regex complejo).
- **Justificación**:
  - Para educación, esto es suficiente.
  - Es fácil de entender y modificar.
  - Un regex profesional sería: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.

### 4. **Event Listeners con Arrow Functions**

```javascript
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // validar y procesar
});
```

- **`preventDefault()`**: Evita que el formulario se envíe (comportamiento por defecto HTML).
- **Arrow function**: Sintaxis moderna de JavaScript (más legible).
- **Alternativa antigua**: `function(event) { ... }` (también válida).

### 5. **Almacenamiento de Datos en Variables Globales**

```javascript
const panelName = document.getElementById("panel-name");
const panelEmail = document.getElementById("panel-email");
```

- **Decisión**: Capturar referencias elementos al inicio.
- **Ventaja**: `querySelector` se llama una sola vez, no "inside" cada función.
- **Rendimiento**: Faster, especialmente si la página creciera.

### 6. **Flujo de Registro Completo**

```javascript
registerForm.reset();        // Limpiar formulario
showPanel(name, email, ...); // Cambiar a vista de panel
```

- **`reset()`**: Borra todos los inputs del formulario.
- **Luego `showPanel()`**: Lleva al usuario a ver su panel.
- **Experiencia**: El usuario vé una acción clara después de registrarse.

---

## Flujo de Usuario

### Caso 1: Iniciar Sesión

1. Usuario está en pestaña "Iniciar sesion" (por defecto).
2. Ingresa **correo** y **contraseña**.
3. Presiona "Entrar".
4. JavaScript valida:
   - ¿Correo contiene `@` y `.`?
   - ¿Contraseña tiene ≥ 6 caracteres?
5. Si hay error → Muestra mensaje rojo.
6. Si es válido → Muestra panel con nombre "Usuario", el correo ingresado, y estado "Sesion iniciada".

### Caso 2: Registrar Cuenta

1. Usuario hace clic en pestaña "Registrarse".
2. Ingresa **nombre**, **correo**, **contraseña**, **confirmar contraseña**.
3. Presiona "Crear cuenta".
4. JavaScript valida:
   - ¿Nombre ≥ 3 caracteres?
   - ¿Correo válido?
   - ¿Contraseña ≥ 8 caracteres?
   - ¿Confirmación coincide con contraseña?
5. Si hay error → Muestra mensaje rojo, permanece en formulario.
6. Si es válido:
   - Limpia el formulario de registro.
   - Muestra el panel con el nombre registrado y estado "Cuenta registrada".

### Caso 3: Cerrar Sesión

1. Usuario en el panel hace clic en "Cerrar sesion".
2. Vuelve a la vista de login.
3. Puede intentar otro login o ir a registro.

---

## Cómo Extenderlo

### 1. **Agregar Persistencia con LocalStorage**

```javascript
// Al registrar:
localStorage.setItem("users", JSON.stringify([...]));

// Al iniciar sesión:
const users = JSON.parse(localStorage.getItem("users"));
```

- Guardará cuentas entre recargas de página.
- Próximo paso natural para este proyecto.

### 2. **Agregar Más Campos**

```html
<input id="register-phone" type="tel" placeholder="Teléfono" />
```

- Simplemente agregar input en HTML y validación en JS.

### 3. **Cambiar a Backend Real**

```javascript
// Reemplazar validación local con fetch:
const response = await fetch("/api/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
```

- Sería un backend (Node.js, Python, Django, etc.).

### 4. **Agregar Estilos Avanzados**

- Transiciones suaves entre vistas.
- Animaciones al escribir en inputs.
- Tema oscuro/claro.

### 5. **Usar un Framework**

- React, Vue, o Angular harían esto más escalable.
- Pero perderías la simplicidad educativa de JavaScript vanilla.

---

## Resumen de Patrones Usado

| Patrón                      | Decisión                         | Razón                                 |
| --------------------------- | -------------------------------- | ------------------------------------- |
| **Una página**              | Todo en `main.html`              | Simplicity & learning                 |
| **CSS sin framework**       | Custom CSS minimalista           | Entender cada propiedad               |
| **Validación duplicada**    | HTML5 + JavaScript               | Control total del flujo               |
| **Vistas con `.hidden`**    | Elementos en DOM, visible/oculto | Evitar manipulación dinámica compleja |
| **Event listeners directo** | Sin delegación de eventos        | Código más lineal para principiantes  |
| **Sin Backend**             | Frontend puro                    | Foco en HTML/CSS/JS                   |

---

## Comandos para Ejecutar

### Opción 1: Abrir archivo directamente

```
Doble clic en main.html
```

### Opción 2: Usar Live Server en VS Code

1. Instala extensión "Live Server"
2. Clic derecho en `main.html` → "Open with Live Server"

---

## Conclusión

Este proyecto es un **punto de partida educativo** que enseña:

- ✅ Estructura HTML semántica.
- ✅ CSS básico pero efectivo.
- ✅ JavaScript vanilla (sin dependencias).
- ✅ Flujos de usuario simples.
- ✅ Validación en cliente.

Desde aquí, puedes extender fácilmente a:

- LocalStorage (persistencia).
- Fetch API (Backend real).
- Frameworks (React, Vue).
- Diseño más avanzado.

**Lo importante**: Cada linea de código tiene una razón y es modificable para tu aprendizaje. 🚀

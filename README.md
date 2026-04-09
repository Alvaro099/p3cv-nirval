# 🎮 Persona 3 Website

Sitio web personal con estética inspirada en **Persona 3**, construido con React + Vite. Incluye menú animado, páginas de perfil, curriculum, redes sociales y más.

---

## 📋 Requisitos previos

Antes de comenzar, asegurate de tener instalado:

- [Node.js](https://nodejs.org/) — versión 18 o superior
- [npm](https://www.npmjs.com/) — viene incluido con Node.js

Verificá que estén instalados:

```bash
node -v
npm -v
```

---

## 🚀 Cómo correr el proyecto en local

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd persona3-website-main
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El sitio estará disponible en: **http://localhost:5173**

> El servidor se actualiza automáticamente cada vez que guardás un archivo (Hot Module Replacement).

### Otros comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el bundle de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint para verificar el código |

---

## 🗂️ Estructura del proyecto

```
persona3-website-main/
├── src/
│   ├── App.jsx              # Punto de entrada, define todas las rutas
│   ├── P3Menu.jsx           # Menú principal (pantalla de inicio)
│   ├── AboutMe.jsx          # Página "Sobre mí"
│   ├── ResumePage.jsx       # Página de curriculum
│   ├── Socials.jsx          # Página de redes sociales
│   ├── PageTransition.jsx   # Componente de transición animada
│   ├── assets/              # Videos, imágenes e íconos
│   └── index.css            # Estilos globales
├── public/                  # Archivos estáticos públicos
├── index.html               # HTML raíz
├── vite.config.js           # Configuración de Vite
└── package.json             # Dependencias y scripts
```

---

## ✏️ Dónde se realizan los cambios de texto (labels)

### 🏠 Menú principal — `src/P3Menu.jsx`

El menú principal tiene dos secciones de texto modificables:

#### 1. Ítems del menú (líneas 3–9)

```jsx
const ITEMS = [
  { id: "about",    label: "SOBRE MI",   ... },
  { id: "resume",   label: "CURRICULUM", ... },
  { id: "github",   label: "PROYECTOS",  ... },
  { id: "socials",  label: "REDES",      ... },
  { id: "sideproj", label: "PROYECTOS",  ... },
];
```

Cada objeto tiene un campo `label` que es el texto que se muestra en el menú.

#### 2. Hints del teclado (líneas 292–293)

```jsx
<div className="p3-hint-row">
  <span className="p3-hint-key">↑↓</span>
  <span>NAVEGAR</span>   {/* ← cambiar aquí */}
</div>
<div className="p3-hint-row">
  <span className="p3-hint-key">↵</span>
  <span>CONFIRMAR</span> {/* ← cambiar aquí */}
</div>
```

#### 3. Nombre en la esquina (línea 220)

```jsx
<div className="p3-name-tag">
  <span></span>
  <span>Nirval</span>  {/* ← tu nombre aquí */}
</div>
```

---

### 👤 Página "Sobre mí" — `src/AboutMe.jsx`

Esta página tiene tres secciones con labels modificables:

#### 1. Labels de las barras del menú lateral (líneas 46–71)

```jsx
const ITEMS = [
  { id: "twitch",    label: "SOBRE MI",            ... },
  { id: "instagram", label: "MUSICA",               ... },
  { id: "tiktok",    label: "WIRED FACT ABOUT ME",  ... },
];
```

El campo `label` es el texto que aparece en cada barra del selector lateral.

#### 2. Roles de los personajes (líneas 40–44)

```jsx
const ROLES = [
  { text: "LEADER", ... },
  { text: "PARTY",  ... },
  { text: "PARTY",  ... },
];
```

El campo `text` muestra el rol rotado que aparece a la izquierda de cada barra.

#### 3. Contenido del panel revelado (líneas 17–38)

```jsx
const REVEAL_CONTENT = [
  {
    upper: ["name moneybagg", "age:23"],
    lower: "major: computer science",
  },
  { ... },
  { ... },
];
```

Este contenido se muestra cuando se presiona `Enter` o `→` sobre un ítem. Los campos `upper` (array de líneas) y `lower` (texto inferior) son los que se personalizan.

#### 4. Hints del teclado (líneas 644–648)

```jsx
<div className="sc-footer-row">
  <span className="sc-footer-key">↑↓</span>
  <span>SELECT</span>   {/* ← cambiar aquí */}
</div>
<div className="sc-footer-row">
  <span className="sc-footer-key">↵</span>
  <span>REVEAL</span>   {/* ← cambiar aquí */}
</div>
<div className="sc-footer-row">
  <span className="sc-footer-key">ESC</span>
  <span>BACK</span>     {/* ← cambiar aquí */}
</div>
```

---

## 🔗 Rutas del sitio

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `P3Menu` | Menú principal |
| `/about` | `AboutMe` | Página "Sobre mí" |
| `/resume` | `ResumePage` | Curriculum vitae |
| `/socials` | `Socials` | Redes sociales |

Las rutas se definen en **`src/App.jsx`**.

---

## 🛠️ Tecnologías utilizadas

- **React 19** — Framework de UI
- **Vite 5** — Build tool y servidor de desarrollo
- **React Router DOM 7** — Navegación entre páginas
- **Framer Motion 12** — Animaciones de transición
- **Google Fonts** — Fuentes (Anton, Bebas Neue, Montserrat)


---

# 🪑 **Mueblería Hermanos Jota**

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react\&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

> **Proyecto Full Stack de e-commerce** desarrollado para la empresa ficticia **Mueblería Hermanos Jota**, especializado en la gestión integral de catálogo, carrito, checkout y contacto.
> Incluye **CRUD completo de productos con imágenes**, **diseño responsive**, **carrito persistente**, y **panel administrativo mejorado**.

---

## 🚀 **Stack Tecnológico**

| Área              | Tecnologías                                                                       |
| ----------------- | --------------------------------------------------------------------------------- |
| **Frontend**      | React, Hooks (`useState`, `useEffect`, `useContext`), CSS3 modular, Responsive UI |
| **Backend**       | Node.js, Express, MongoDB, Mongoose, Multer, dotenv, CORS                         |
| **Herramientas**  | Nodemon, Git, VSCode, MongoDB Compass, Postman                                    |
| **Estilo Visual** | UI limpia tipo dashboard, estética industrial con acentos dorados                 |

---

## 🧩 **Estructura del Proyecto**

```
muebleria-hermanos-jota/
├── backend/
│   ├── controllers/        # Lógica de negocio
│   ├── data/               # Datos mock (modo sin MongoDB)
│   ├── middleware/         # Configuración de Multer, CORS, validaciones
│   ├── models/             # Modelos Mongoose (Producto, Contacto)
│   ├── public/images/      # Imágenes subidas por usuarios
│   ├── routes/             # Endpoints API
│   ├── .env                # Variables de entorno
│   ├── index.js            # Servidor principal
│   └── package.json
├── client/
│   ├── public/images/      # Recursos estáticos
│   ├── src/
│   │   ├── assets/         # Íconos, backgrounds, logos
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Vistas (Inicio, Checkout, Contacto, Admin, etc.)
│   │   ├── styles/         # Estilos CSS optimizados por módulo
│   │   ├── App.jsx         # Root del frontend
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## 🧠 **Arquitectura General**

El sistema se compone de **dos capas desacopladas**:

* 🖥️ **Frontend React**: interfaz dinámica, 100% responsive, conectada vía Fetch API.
* ⚙️ **Backend Express + MongoDB**: API REST con validaciones, persistencia y manejo de archivos (Multer).

Comunicación mediante **HTTP (RESTful)** con CORS habilitado.

---

## ⚡ **Backend**

### 🔧 Dependencias Principales

```bash
npm install express cors dotenv mongoose multer nodemon
```

### 🧭 Scripts (`backend/package.json`)

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

### 🌐 Endpoints Principales

| Método | Ruta                 | Descripción                                  |
| ------ | -------------------- | -------------------------------------------- |
| GET    | `/`                  | Mensaje de bienvenida                        |
| GET    | `/api/productos`     | Listar todos los productos                   |
| GET    | `/api/productos/:id` | Obtener producto por ID                      |
| POST   | `/api/productos`     | Crear nuevo producto (con imagen via Multer) |
| PUT    | `/api/productos/:id` | Editar producto existente                    |
| DELETE | `/api/productos/:id` | Eliminar producto                            |
| POST   | `/api/contacto`      | Enviar mensaje de contacto                   |

### ⚙️ Variables de Entorno de Ejemplo (`.env`)

```env
PORT=5000
CORS_ORIGIN=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/muebleria
```

---

## 🎨 **Frontend React**

### 💻 Dependencias

```bash
npm install react-router-dom
npm install
```

### 🧭 Scripts (`client/package.json`)

```bash
npm start   # Ejecuta el proyecto en modo desarrollo
npm build   # Genera build optimizado para producción
```

---

## 🧱 **Componentes Clave**

| Componente      | Descripción                                              |
| --------------- | -------------------------------------------------------- |
| `Navbar`        | Barra superior con logo, enlaces y contador del carrito  |
| `HeroBanner`    | Sección principal con presentación visual del catálogo   |
| `Destacados`    | Muestra productos destacados dinámicamente               |
| `ProductList`   | Lista completa de productos                              |
| `ProductCard`   | Card visual con nombre, imagen, precio y botón de compra |
| `ProductDetail` | Detalle completo del producto con descripción e imagen   |
| `ModalCarrito`  | Modal interactivo para gestionar productos agregados     |
| `CheckoutPage`  | Resumen de compra y confirmación                         |
| `ContactForm`   | Formulario con validaciones y feedback visual            |
| `AdminPanel`    | CRUD completo: crear, editar y eliminar productos        |
| `Footer`        | Información institucional y contacto                     |

---

## 💾 **CRUD de Productos (Panel Admin)**

Se implementó un sistema administrativo completo con interfaces optimizadas:

* **Crear Producto:** formulario validado, vista previa de imagen y subida con Multer.
* **Editar Producto:** precarga automática de datos, previsualización de imagen, validación dinámica.
* **Eliminar Producto:** listado con diseño claro, animaciones hover y alertas visuales.

✅ Todos los formularios incluyen *transiciones suaves, sombras, bordes redondeados y coherencia visual*.
✅ Totalmente *responsive* para escritorio y móvil.

---

## 🎨 **Diseño y Estilos (UI/UX)**

* Paleta principal: `#121212` (fondo) + `#FFD700` (acento dorado)
* Tipografía: `Segoe UI` / `Poppins`
* Cards con **glassmorphism ligero**
* Transiciones suaves, sin scrollbars invasivas
* CSS modular, mantenible y coherente entre vistas

Ejemplo de mejora aplicada:

```css
.producto-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  backdrop-filter: blur(6px);
  transition: transform 0.2s, box-shadow 0.2s;
}
.producto-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}
```

---

## 🧰 **Funcionalidades Completas**

✔️ Listado dinámico de productos
✔️ Detalle individual
✔️ Carrito con persistencia en `localStorage`
✔️ Modal interactivo de carrito
✔️ Checkout con resumen de total
✔️ CRUD administrativo con imágenes
✔️ Validaciones en frontend y backend
✔️ Diseño adaptable a dispositivos móviles
✔️ Integración con MongoDB para datos reales

---

## 🧪 **Modo de Ejecución**

1️⃣ **Levantar Backend**

```bash
cd backend
npm install
npm run dev
```

2️⃣ **Levantar Frontend**

```bash
cd client
npm install
npm start
```

Abrir en navegador: [http://localhost:3000](http://localhost:3000)

---

## 🌍 **Despliegue (Opcional)**

**GitHub Pages / Render / Vercel**

* Generar build con:

  ```bash
  cd client
  npm run build
  ```
* Subir carpeta `build` al servidor o configurar GitHub Pages.
* Asegurar conexión con backend desplegado (ajustar URL de API en `.env` o configuración global).

---

## 👨‍💻 **Autores**

| Nombre               
| -------------------- 
| **Alexis Coronel**   
| **Leandro Ferreira** 

---

## 🧾 **Licencia**

Este proyecto se distribuye bajo licencia [MIT](LICENSE).
Puedes usarlo, modificarlo y adaptarlo libremente para fines educativos o comerciales.

---

---

# Mueblería Hermanos Jota

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react\&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

Proyecto de **e-commerce de muebles**, desarrollado con **React** en el frontend y **Node.js + Express + MongoDB** en el backend. Permite ver catálogo de productos, detalle de cada producto, agregar al carrito, realizar checkout, persistencia en localStorage y manejo de imágenes con **Multer**.

---

## 1. Estructura del proyecto

```
muebleria-hermanos-jota/
├── backend/
│   ├── controllers/       # Lógica de negocio y controladores
│   ├── data/              # Datos de ejemplo (si no hay MongoDB)
│   ├── middleware/        # Middlewares personalizados (ej: Multer)
│   ├── models/            # Modelos Mongoose (Producto, Contacto)
│   ├── public/images/     # Imágenes servidas por la API
│   ├── routes/            # Rutas de API
│   ├── .env               # Variables de entorno
│   ├── index.js           # Entrada del servidor
│   └── package.json
├── client/                # Frontend React
│   ├── public/images/     # Imágenes de productos
│   ├── src/
│   │   ├── assets/        # Recursos estáticos
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Vistas principales
│   │   ├── styles/        # Estilos globales y por componente
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## 2. Tecnologías usadas

* **Frontend:** React, CSS3, Hooks (`useState`, `useEffect`, `useCallback`), Fetch API
* **Backend:** Node.js, Express, CORS, MongoDB, Mongoose, Multer
* **Herramientas:** Nodemon, dotenv
* **Otros:** FontAwesome o emojis como fallback

---

## 3. Backend

### 3.1. Dependencias

```bash
npm install express cors dotenv mongoose multer nodemon
```

### 3.2. Scripts (`backend/package.json`)

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

### 3.3. Endpoints principales

| Método | Ruta                 | Descripción                                   |
| ------ | -------------------- | --------------------------------------------- |
| GET    | `/`                  | Mensaje de bienvenida                         |
| GET    | `/api/productos`     | Listado de todos los productos (MongoDB)      |
| GET    | `/api/productos/:id` | Obtener producto específico por id            |
| POST   | `/api/productos`     | Crear producto (usa Multer para subir imagen) |
| PUT    | `/api/productos/:id` | Actualizar producto                           |
| DELETE | `/api/productos/:id` | Eliminar producto                             |
| POST   | `/api/contacto`      | Enviar mensaje de contacto                    |

### 3.4. Variables de entorno (`backend/.env`)

```env
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### 3.5. Levantar backend

```bash
cd backend
npm install
npm run dev
```

> Se ejecutará en `http://localhost:5000`.

---

## 4. Frontend

### 4.1. Instalación de dependencias

```bash
cd client
npm install
```

### 4.2. Scripts (`client/package.json`)

```bash
npm start       # Levanta frontend en http://localhost:3000
npm build       # Genera build de producción
```

### 4.3. Componentes principales

| Componente      | Función                                                                            |
| --------------- | ---------------------------------------------------------------------------------- |
| `Navbar`        | Barra superior, muestra cantidad de productos en carrito                           |
| `HeroBanner`    | Banner principal del inicio                                                        |
| `Destacados`    | Lista de productos destacados                                                      |
| `ProductList`   | Listado completo de productos                                                      |
| `ProductCard`   | Card individual de producto                                                        |
| `ProductDetail` | Detalle de producto seleccionado                                                   |
| `ModalCarrito`  | Modal que muestra productos agregados al carrito, permite eliminar **uno por uno** |
| `Checkout`      | Vista de checkout, muestra productos, total y acciones                             |
| `CheckoutPage`  | Página completa de checkout con validaciones y resumen                             |
| `ContactForm`   | Formulario de contacto                                                             |
| `Footer`        | Pie de página                                                                      |
| `SobreNosotros` | Información sobre la empresa                                                       |
| `Newsletter`    | Suscripción a newsletter                                                           |

---

## 5. Funcionalidades

* Mostrar productos destacados y todo el catálogo
* Ver detalle de producto
* Agregar/eliminar productos del carrito (uno por uno)
* Persistencia de carrito en **localStorage**
* Modal de carrito con total y botones de acción
* Checkout con total, opción de vaciar carrito y finalizar compra
* Formulario de contacto con validación y mensaje de éxito
* Manejo de imágenes con **Multer** al crear productos
* Conexión a **MongoDB** para persistencia real
* Navegación entre vistas (`inicio`, `catálogo`, `contacto`, `checkout`)

---

## 6. Cómo levantar el proyecto completo

1. **Backend:**

```bash
cd backend
npm install
npm run dev
```

2. **Frontend:**

```bash
cd client
npm install
npm start
```

3. Abrir navegador en `http://localhost:3000`.

---

## 7. Notas importantes

* El backend usa **MongoDB** y **Mongoose**, pero mantiene opción de datos en memoria (`data/products.js`) para pruebas.
* Multer gestiona la subida de imágenes al servidor.
* Persistencia de carrito es **frontend** (`localStorage`).
* Frontend y backend separados; CORS habilitado para `localhost:3000`.
* Checkout y modal de carrito actualizados para manejo de cantidad de productos.

---

## 8. Despliegue en GitHub Pages (opcional)

* Ejecutar `npm run build` en `client`.
* Configurar GitHub Pages para servir la carpeta `client/build`.
* Ajustar rutas de la API a backend desplegado.

---

## 9. Alumnos

| Nombre           |
| ---------------- |
| Alexis Coronel   |
| Leandro Ferreira |

---


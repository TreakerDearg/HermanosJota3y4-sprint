#  Mueblería Hermanos Jota

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react\&logoColor=black)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

Proyecto de **e-commerce de muebles**, desarrollado con **React** en el frontend y **Node.js + Express** en el backend. Permite ver catálogo de productos, detalle de cada producto, agregar al carrito, realizar checkout y enviar mensajes de contacto.

---

## 1. Estructura del proyecto

```
muebleria-hermanos-jota/
├── backend/
│   ├── controllers/       # Lógica de negocio y controladores
│   ├── data/              # Datos de ejemplo (productos)
│   ├── middleware/        # Middlewares personalizados
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
│   │   ├── styles/        # Estilos globales y por componente
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## 2. Tecnologías usadas

* **Frontend:** React, CSS3, Hooks (`useState`), Fetch API
* **Backend:** Node.js, Express, CORS
* **Herramientas:** Nodemon, dotenv
* **Otros:** FontAwesome o emojis como fallback

---

## 3. Backend

### 3.1. Dependencias

```bash
npm install express cors dotenv nodemon
```

### 3.2. Scripts (`backend/package.json`)

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

### 3.3. Endpoints

| Método | Ruta                 | Descripción                        |
| ------ | -------------------- | ---------------------------------- |
| GET    | `/`                  | Mensaje de bienvenida              |
| GET    | `/api/productos`     | Listado de todos los productos     |
| GET    | `/api/productos/:id` | Obtener producto específico por id |

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

| Componente      | Función                                                  |
| --------------- | -------------------------------------------------------- |
| `Navbar`        | Barra superior, muestra cantidad de productos en carrito |
| `HeroBanner`    | Banner principal del inicio                              |
| `Destacados`    | Lista de productos destacados                            |
| `ProductList`   | Listado completo de productos                            |
| `ProductCard`   | Card individual de producto                              |
| `ProductDetail` | Detalle de producto seleccionado                         |
| `ModalCarrito`  | Modal que muestra productos agregados al carrito         |
| `Checkout`      | Vista de checkout, muestra productos y total             |
| `ContactForm`   | Formulario de contacto                                   |
| `Footer`        | Pie de página                                            |
| `SobreNosotros` | Información sobre la empresa                             |
| `Newsletter`    | Suscripción a newsletter                                 |

---

## 5. Funcionalidades

* Mostrar productos destacados y todo el catálogo
* Ver detalle de producto
* Agregar/eliminar productos del carrito
* Modal de carrito con total y botones de acción
* Checkout con total y opción de vaciar carrito
* Formulario de contacto con validación y mensaje de éxito
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

* El backend actualmente usa un **array en memoria** (`data/products.js`).
* Imágenes de productos en `client/public/images/` o `backend/public/images/`.
* Frontend y backend separados; CORS habilitado para `localhost:3000`.
* Persistencia de carrito **solo en frontend**.
* Para integrar envío de formulario al backend, se puede agregar `POST /api/contacto`.

---

## 8. Despliegue en GitHub Pages (opcional)

* Ejecutar `npm run build` en `client`.
* Configurar GitHub Pages para servir la carpeta `client/build`.
* Asegurarse de que las rutas de la API apunten al backend desplegado.

---

## 9. Alumnos

| Nombre         |
| Alexis Coronel
| Leandro Ferreira    
---



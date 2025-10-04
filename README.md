Mueblería Hermanos Jota

Proyecto de **e-commerce de muebles**, construido con **React** en el frontend y **Node.js + Express** en el backend. El proyecto incluye catálogo de productos, detalle de productos, carrito de compras, checkout, formulario de contacto y rutas de backend para productos.

---

## 1. Estructura del proyecto

```
muebleria-hermanos-jota/
├── backend/
│   ├── controllers/
│   │   └── productosController.js
│   ├── data/
│   │   └── products.js
│   ├── routes/
│   │   └── productos.js
│   ├── .env
│   ├── index.js
│   └── package.json
├── client/
│   ├── public/
│   │   └── images/       # Imágenes de productos
│   ├── src/
│   │   ├── components/
│   │   │   ├── Checkout.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   ├── Destacados.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── ModalCarrito.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── SobreNosotros.jsx
│   │   │   └── Newsletter.jsx
│   │   ├── styles/
│   │   │   └── *.css
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
├── README.md
```

---

## 2. Tecnologías usadas

* **Frontend:** React, CSS3, Hooks (`useState`), Fetch API
* **Backend:** Node.js, Express, CORS
* **Herramientas:** Nodemon, dotenv
* **Otros:** Fuentes de iconos (FontAwesome o emojis como fallback)

---

## 3. Backend

### 3.1. Dependencias

```bash
npm install express cors dotenv nodemon
```

### 3.2. Scripts de backend (`package.json`)

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

### 3.3. Endpoints implementados

| Método | Ruta                 | Descripción                    |
| ------ | -------------------- | ------------------------------ |
| GET    | `/`                  | Mensaje de bienvenida          |
| GET    | `/api/productos`     | Listado de todos los productos |
| GET    | `/api/productos/:id` | Producto específico por id     |

### 3.4. Correr backend

```bash
cd backend
npm install
npm run dev
```

> El backend correrá en `http://localhost:5000` por defecto (puede configurarse en `.env`).

---

## 4. Frontend

### 4.1. Dependencias

```bash
npm install
```

* React (creado con `create-react-app`)
* CSS puro con módulos por componente
* (Opcional) FontAwesome para iconos

### 4.2. Scripts de frontend (`package.json`)

```bash
npm start       # Levanta el frontend en http://localhost:3000
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

### 4.4. Funcionalidades del frontend

* Mostrar productos destacados y todo el catálogo
* Ver detalle de producto
* Agregar/eliminar productos del carrito
* Modal de carrito con total y botones de acción
* Checkout con total y opción de vaciar carrito
* Formulario de contacto con validación básica y mensaje de éxito
* Navegación entre vistas (`inicio`, `catálogo`, `contacto`, `checkout`)

---

## 5. Variables de entorno (`backend/.env`)

```env
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

---

## 6. Cómo levantar todo el proyecto

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

* Actualmente el backend utiliza un **array en memoria** para productos (`data/products.js`).
* Las imágenes de productos deben estar en `client/public/images/`.
* El frontend y backend están separados; CORS está habilitado para `localhost:3000`.
* La persistencia de carrito aún se maneja **solo en frontend**.
* Para integrar envío de formulario al backend, se puede agregar endpoint `POST /api/contacto`.

---


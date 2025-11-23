
---

# 🪑 **Mueblería Hermanos Jota - README Técnico Avanzado**

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react\&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb\&logoColor=white)](https://www.mongodb.com/)

> Proyecto Full Stack de e-commerce con **CRUD completo de productos**, **carrito persistente**, **checkout**, **panel administrativo**, **Cloudinary**, **JWT**, **Bcrypt** y diseño industrial profesional.

---

## 🌐 **Arquitectura General**

```mermaid
graph TD
A[Frontend React] -->|Fetch API| B[Backend Express]
B -->|Mongoose| C[MongoDB]
B -->|Cloudinary API| D[Cloudinary]
A -->|Context API| E[AuthContext / CartContext / ProductContext]
```

* **Frontend React:** Interfaz dinámica, responsive, modales, checkout y panel admin.
* **Backend Express:** Endpoints REST, validaciones, autenticación y subida de imágenes.
* **MongoDB:** Persistencia de productos, usuarios y mensajes de contacto.
* **Cloudinary:** Almacenamiento de imágenes de productos.

---

## 🧰 **Librerías Instaladas (Backend)**

```bash
npm install express mongoose cors dotenv multer cloudinary bcryptjs jsonwebtoken nodemon
```

* **Express:** Servidor HTTP y rutas.
* **Mongoose:** Modelos y CRUD en MongoDB.
* **Multer + Cloudinary:** Subida y almacenamiento de imágenes.
* **Bcryptjs:** Hash de contraseñas.
* **JSON Web Token (JWT):** Autenticación segura.
* **Dotenv + CORS:** Configuración de entorno y seguridad.

---

## 🔧 **Estructura Backend**

```
backend/
├── controllers/   # Logica: auth, productos, usuarios, contacto
├── middleware/    # Multer, Cloudinary, auth JWT, validaciones
├── models/        # Schemas: Producto, Usuario, Contacto
├── routes/        # Endpoints API
├── public/images/ # Imágenes locales
├── index.js       # Servidor principal
└── .env           # Variables de entorno
```

---

## 🔑 **Flujo de Autenticación**

```mermaid
flowchart TD
A[Usuario envía login/register] --> B[Controller Auth]
B --> C[Validación con Bcrypt]
C --> D[Generación de JWT]
D --> E[Token enviado al Frontend]
E --> F[AuthContext guarda token y usuario]
```

* El token se envía en cada request protegido.
* Roles: `admin` y `usuario`.
* Middleware verifica rol y token para proteger rutas.

---

## 📦 **Flujo de Carrito y Checkout**

```mermaid
flowchart TD
A[Usuario añade productos] --> B[CartContext]
B --> C[ModalCarrito] --> D[Actualizar cantidad / eliminar]
D --> E[CheckoutPage genera recibo]
E --> F[Vaciar Carrito]
F --> G[Resumen final y registro de compra]
```

* Carrito se persiste en `localStorage` por usuario.
* Checkout genera un recibo temporal y vacía carrito al finalizar.

---

## 🖥️ **Flujo CRUD Admin (Productos)**

```mermaid
flowchart TD
A[Admin Panel] --> B[Crear / Editar / Eliminar Producto]
B --> C[Controller Productos]
C --> D[Model Producto (MongoDB)]
D --> E[Respuesta JSON al Frontend]
```

* **Crear Producto:** Formulario + subida de imagen a Cloudinary.
* **Editar Producto:** Precarga datos, editar imagen y validaciones.
* **Eliminar Producto:** Confirmación en página separada.
* Tabla de productos con filtros, destacados y stock bajo resaltado.

---

## 🖼️ **Flujo de Subida de Imágenes (Cloudinary)**

```mermaid
flowchart TD
A[Frontend Form] --> B[Multer]
B --> C[Cloudinary API]
C --> D[URL de imagen guardada en MongoDB]
D --> E[Frontend muestra la imagen actualizada]
```

* Optimiza almacenamiento y reduce peso en servidor.
* Soporta múltiples formatos y previsualización antes de guardar.

---

## 💻 **Frontend - Context API**

* **AuthContext:** Manejo de sesión, roles y token JWT.
* **CartContext:** Manejo de carrito persistente con métodos: agregar, eliminar, vaciar, actualizar cantidad.
* **ProductContext:** Manejo de productos, destacados y filtros.
* **UIContext:** Gestión de modales y estado visual global.

---

## 🎨 **UI/UX**

* Paleta: Fondo oscuro `#121212`, acento dorado `#FFD700`.
* Tipografía: `Segoe UI` / `Poppins`.
* Cards: Glassmorphism, bordes redondeados, transiciones suaves.
* Responsive para escritorio, tablet y móvil.

---

## 🚀 **Ejecución del Proyecto**

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm start
```

---

## 🌍 **Despliegue**

* Generar build optimizado: `npm run build`
* Subir carpeta `build` a servidor o configurar GitHub Pages / Vercel / Render
* Ajustar URL de backend en `.env`

---

## 👨‍💻 **Autores**

| Nombre           | Rol                |
| ---------------- | ------------------ |
| Alexis Coronel   | Frontend & Backend |
| Leandro Ferreira | Frontend & UI/UX   |

---

## 🧾 **Licencia**

MIT License – libre uso, modificación y adaptación.

---

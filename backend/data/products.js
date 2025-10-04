// backend/data/products.js

const productos = [
  {
    id: 1,
    nombre: "Mesa de Comedor Pampa",
    descripcion: "Mesa de comedor en madera de roble macizo con acabado natural.",
    precio: 35000,
    imagen: "images/Butaca Mendoza.png",
    destacado: true
  },
  {
    id: 2,
    nombre: "Silla Contemporánea",
    descripcion: "Silla de madera y tapizado en tela premium, ideal para salas modernas.",
    precio: 12000,
    imagen: "images/Silla de Trabajo Belgrano.png",
    destacado: true
  },
  {
    id: 3,
    nombre: "Estantería Modular",
    descripcion: "Estantería en madera de pino, diseño modular y flexible para cualquier espacio.",
    precio: 22000,
    imagen: "images/Biblioteca Recoleta.png",
    destacado: true
  },
  {
    id: 4,
    nombre: "Mesa de Centro Vintage",
    descripcion: "Mesa de centro con detalles artesanales y acabado envejecido.",
    precio: 18000,
    imagen: "images/Mesa de Centro Araucaria.png",
    destacado: true
  },
  {
    id: 5,
    nombre: "Silla Copacabana",
    descripcion: "Banco en madera maciza, perfecto para entradas o como asiento adicional.",
    precio: 9000,
    imagen: "images/SillonCopacabana.png",
    destacado: false
  }
];

// Exportamos para poder usarlo en el servidor
export default productos;

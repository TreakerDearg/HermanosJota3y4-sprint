// backend/data/products.js

const productos = [
  {
    id: 1,
    nombre: "Mesa de Comedor Pampa",
    descripcion: "Roble macizo, acabado natural y diseño elegante. Perfecta para tus comidas y reuniones familiares con estilo.",
    precio: 35000,
    imagen: "/images/MesaComedorPampa.png",
    destacado: true,
    categoria: "Mesas",
    stock: 12
  },
  {
    id: 2,
    nombre: "Silla Contemporánea",
    descripcion: "Comodidad premium y diseño moderno. Tapizado suave y estructura en madera resistente para tu sala o comedor.",
    precio: 12000,
    imagen: "/images/SilladeTrabajoBelgrano.png",
    destacado: true,
    categoria: "Sillas",
    stock: 25
  },
  {
    id: 3,
    nombre: "Estantería Modular",
    descripcion: "Organiza con estilo. Modular, flexible y de madera de pino, ideal para cualquier espacio y decoración.",
    precio: 22000,
    imagen: "/images/BibliotecaRecoleta.png",
    destacado: true,
    categoria: "Estantes",
    stock: 10
  },
  {
    id: 4,
    nombre: "Mesa de Centro Vintage",
    descripcion: "Estilo vintage único. Detalles artesanales y acabado envejecido que dan carácter a tu sala de estar.",
    precio: 18000,
    imagen: "/images/MesaDeCentroVintage (2).png",
    destacado: true,
    categoria: "Mesas",
    stock: 8
  },
  {
    id: 5,
    nombre: "Silla Copacabana",
    descripcion: "Banco robusto de madera maciza. Funcional, elegante y perfecto para entradas o como asiento adicional.",
    precio: 9000,
    imagen: "/images/SillonCopacabana.png",
    destacado: false,
    categoria: "Sillas",
    stock: 20
  },
  {
    id: 6,
    nombre: "Aparador Uspallata",
    descripcion: "Amplio, elegante y de roble natural. Perfecto para mantener todo organizado sin sacrificar estilo.",
    precio: 27000,
    imagen: "/images/AparadorUspallata.png",
    destacado: false,
    categoria: "Estantes",
    stock: 6
  },
  {
    id: 7,
    nombre: "Mesa de Noche Aconcagua",
    descripcion: "Elegante y funcional. Madera maciza que combina con cualquier dormitorio moderno y acogedor.",
    precio: 8500,
    imagen: "/images/MesadeNocheAconcagua.png",
    destacado: false,
    categoria: "Mesas",
    stock: 15
  },
  {
    id: 8,
    nombre: "Mesa de Centro Araucaria",
    descripcion: "Artesanía en madera de Araucaria. Estilo y calidez que transforman tu sala de estar.",
    precio: 15000,
    imagen: "/images/MesadeCentroAraucaria.png",
    destacado: false,
    categoria: "Mesas",
    stock: 10
  },
  {
    id: 9,
    nombre: "Escritorio Costa",
    descripcion: "Amplio y moderno. Madera de pino resistente, ideal para tu oficina o espacio de trabajo en casa.",
    precio: 21000,
    imagen: "/images/EscritorioCosta.png",
    destacado: false,
    categoria: "Escritorios",
    stock: 7
  }
];

export default productos;

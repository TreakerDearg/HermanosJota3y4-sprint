import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    imagenUrl: { type: String }, // usamos imagenUrl para mantener consistencia con frontend
    destacado: { type: Boolean, default: false },
    categoria: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Producto", productoSchema);

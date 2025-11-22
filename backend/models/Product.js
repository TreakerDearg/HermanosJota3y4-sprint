import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    imagenUrl: { type: String },
    destacado: { type: Boolean, default: false },
    categoria: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

// Evita OverwriteModelError cuando ya existe
export default mongoose.models.Producto ||
  mongoose.model("Producto", productoSchema);

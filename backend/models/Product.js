import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    imagen: { type: String }, // ruta o URL de imagen
    destacado: { type: Boolean, default: false },
    categoria: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Producto", productoSchema);

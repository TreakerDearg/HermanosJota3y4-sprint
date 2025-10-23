import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    imagen: { type: String },       // ruta de la imagen (ej: /images/xxx.png)
    destacado: { type: Boolean, default: false },
    categoria: { type: String }
  },
  { timestamps: true } // crea campos createdAt y updatedAt automáticamente
);

export default mongoose.model("Producto", productoSchema);

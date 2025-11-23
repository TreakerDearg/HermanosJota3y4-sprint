import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },

    // 🔥 AQUI: Compatibilidad Cloudinary REAL
    imagen: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    destacado: {
      type: Boolean,
      default: false,
    },

    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Producto ||
  mongoose.model("Producto", productoSchema);

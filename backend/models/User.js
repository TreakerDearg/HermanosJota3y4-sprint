// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Por favor ingresa un email válido",
      ],
      index: true,
    },

    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: 6,
      select: false,
    },

    rol: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ================================
    // 🆕 CAMPOS DE PERFIL OPCIONALES
    // ================================
    telefono: {
      type: String,
      trim: true,
      default: "",
      maxlength: 20,
    },

    direccion: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    // ================================
    // Favoritos
    // ================================
    favoritos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
      },
    ],

    // ================================
    // Carrito
    // ================================
    carrito: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
        },
        cantidad: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

// =====================================================
// 🔐 PRE-SAVE HASH PASSWORD (solo si fue modificada)
// =====================================================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// =====================================================
// 🔑 COMPARAR CONTRASEÑA (login)
// =====================================================
userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);

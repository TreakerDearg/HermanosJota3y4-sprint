// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { successResponse, createdResponse } from "../middlewares/responseHandler.js";

// ==================================================
// 🔐 Generate JWT
// ==================================================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ==================================================
// 📧 Email validation
// ==================================================
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ==================================================
// 📝 REGISTER
// ==================================================
export const registerUser = asyncHandler(async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password)
    throw new Error("Todos los campos son obligatorios");

  if (!validateEmail(email)) throw new Error("Formato de email inválido");

  if (password.length < 6)
    throw new Error("La contraseña debe tener al menos 6 caracteres");

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) throw new Error("Este email ya está registrado");

  const user = await User.create({
    nombre,
    email,
    password, // hook pre-save hace hash
    rol: rol === "admin" ? "admin" : "user",
  });

  createdResponse(
    res,
    {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      token: generateToken(user),
    },
    "Usuario registrado correctamente",
    req
  );
});

// ==================================================
// 🔑 LOGIN
// ==================================================
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ mensaje: "Email y contraseña son obligatorios" });

  if (!validateEmail(email))
    return res.status(400).json({ mensaje: "Formato de email inválido" });

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ mensaje: "Credenciales inválidas" });

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid)
    return res.status(401).json({ mensaje: "Credenciales inválidas" });

  const token = generateToken(user);

  successResponse(
    res,
    {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      token,
    },
    "Inicio de sesión exitoso",
    req
  );
});

// ==================================================
// 👤 GET AUTH USER PROFILE
// ==================================================
export const getMe = asyncHandler(async (req, res) => {
  if (!req.user?.id) throw new Error("No autorizado");

  const user = await User.findById(req.user.id).select("-password");
  if (!user) throw new Error("Usuario no encontrado");

  successResponse(res, user, "Perfil obtenido correctamente", req);
});

// ==================================================
// ✏️ UPDATE PROFILE (nombre, email, tel, direccion)
// ==================================================
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { nombre, email, telefono, direccion } = req.body;

  if (!nombre || !email)
    throw new Error("Nombre y email son obligatorios");

  if (!validateEmail(email)) throw new Error("Formato de email inválido");

  const user = await User.findById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  // Email duplicado en otros usuarios
  const emailExists = await User.findOne({ email, _id: { $ne: userId } });
  if (emailExists)
    throw new Error("Este email ya está en uso por otro usuario");

  // Actualizar datos
  user.nombre = nombre;
  user.email = email;

  if (telefono !== undefined) user.telefono = telefono;
  if (direccion !== undefined) user.direccion = direccion;

  await user.save();

  successResponse(
    res,
    {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono ?? "",
      direccion: user.direccion ?? "",
      rol: user.rol,
    },
    "Perfil actualizado correctamente",
    req
  );
});

// ==================================================
// 🔐 CHANGE PASSWORD
// ==================================================
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword)
    throw new Error("Debes ingresar tu contraseña actual y la nueva");

  if (newPassword.length < 6)
    throw new Error("La nueva contraseña debe tener al menos 6 caracteres");

  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("Usuario no encontrado");

  const isCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isCorrect) throw new Error("La contraseña actual es incorrecta");

  user.password = newPassword; // hook hace hash
  await user.save();

  successResponse(res, {}, "Contraseña actualizada correctamente", req);
});

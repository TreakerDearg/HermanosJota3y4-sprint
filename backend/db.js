import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado a MongoDB Atlas correctamente");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1); // Salir del proceso si falla la conexión
  }
};

// Opcional: escuchar eventos de conexión
mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose conectado a la base de datos");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Error de conexión Mongoose:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose desconectado de la base de datos");
});

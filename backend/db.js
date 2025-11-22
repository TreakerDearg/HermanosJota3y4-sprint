// db.js
import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    if (!uri) {
      console.error("❌ MONGO_URI no está definido en .env");
      process.exit(1);
    }

    // Evitar múltiples conexiones si el servidor hace hot-reload
    if (mongoose.connection.readyState === 1) {
      console.log("⚠️ Ya existe una conexión activa a MongoDB");
      return;
    }

    await mongoose.connect(uri, {
      // Opciones modernas: Mongoose 7+ usa defaults estables
      serverSelectionTimeoutMS: 5000, // corta rápido si falla
      socketTimeoutMS: 45000,
    });

    console.log("🍃 MongoDB conectado con éxito");

  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1);
  }
};

// ==================================================
// Eventos de conexión (útiles en producción/render)
// ==================================================
mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose conectado a la base de datos");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Error en la conexión de Mongoose:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose se desconectó");
});

// Intento de reconexión automática
mongoose.connection.on("reconnectFailed", () => {
  console.error("❌ Fallo la reconexión a MongoDB");
});

// Manejar Ctrl + C
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔻 Conexión a MongoDB cerrada por terminación del proceso");
  process.exit(0);
});

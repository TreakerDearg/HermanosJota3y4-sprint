import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  }
};

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Producto.js";
import productos from "./data/products.js";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB MuebleriaJota");

    await Product.deleteMany();       // Borra productos antiguos
    await Product.insertMany(productos); // Inserta los nuevos

    console.log(`📦 Insertados ${productos.length} productos`);
  } catch (err) {
    console.error("❌ Error al seedear:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();



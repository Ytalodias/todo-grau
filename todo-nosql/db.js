require('dotenv').config(); // importa o dotenv
const mongoose = require('mongoose');

// Pega a URL do MongoDB do .env
const uri = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado ao MongoDB Atlas com Mongoose!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
  }
}

connectDB();

module.exports = mongoose;

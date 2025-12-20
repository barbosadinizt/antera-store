const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 ISSO AQUI É O QUE FALTAVA
app.use(express.static(path.join(__dirname, "public")));

// rota de teste
app.get("/health", (req, res) => {
  res.send("Servidor OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});

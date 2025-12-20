import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Corrigir __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos corretamente
app.use(express.static(path.join(__dirname, "public")));

// Permitir JSON no body
app.use(express.json());

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Mercado Pago (mantemos depois)
app.post("/create_preference", async (req, res) => {
  res.json({ ok: true });
});

// Start
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Necessário para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 SERVIR A PASTA PUBLIC CORRETAMENTE
app.use(express.static(path.join(__dirname, "public")));

// JSON
app.use(express.json());

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// (seu endpoint de pagamento pode ficar aqui depois)

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});

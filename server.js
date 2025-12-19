import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ===============================
// MERCADO PAGO
// ===============================
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

// ===============================
// CRIAR PREFERÊNCIA
// ===============================
app.post("/create_preference", async (req, res) => {
  try {
    const { items } = req.body;

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          items,
          back_urls: {
            success: "https://SEU-SITE.onrender.com/sucesso.html",
            failure: "https://SEU-SITE.onrender.com/erro.html",
            pending: "https://SEU-SITE.onrender.com/erro.html"
          },
          auto_return: "approved"
        })
      }
    );

    const data = await response.json();
    res.json({ init_point: data.init_point });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});

// ===============================
// INICIAR SERVIDOR
// ===============================
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

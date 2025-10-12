const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ✅ Paso 1: Verificación inicial con Meta
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Paso 2: Recepción de mensajes desde WhatsApp
app.post("/webhook", async (req, res) => {
  console.log("Mensaje recibido:", JSON.stringify(req.body, null, 2));

  try {
    // 👉 Aquí pon la URL de tu flujo n8n (Webhook node)
    await axios.post("https://primary-production-1e8e.up.railway.app/workflow/6xqLRPJjzlNMVio4/4a9019", req.body);
  } catch (error) {
    console.error("Error enviando a n8n:", error.message);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));

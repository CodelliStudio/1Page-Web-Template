// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("./")); // Sirve tu web

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Tu clave de OpenAI
});

// Historial de conversaciones por sesión
const sessions = {};

// Middleware para asignar sessionId si no existe
app.use((req, res, next) => {
  if (!req.headers["x-session-id"]) {
    req.sessionId = randomUUID();
    res.setHeader("x-session-id", req.sessionId);
  } else {
    req.sessionId = req.headers["x-session-id"];
  }
  next();
});

// Endpoint de chat
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const sessionId = req.sessionId;

  // Crear historial si es la primera vez
  if (!sessions[sessionId]) {
    sessions[sessionId] = [
      {
        role: "system",
        content: "Eres 'CodeBot', un asesor de soporte super amable y persuasivo para Codelli Studio, una empresa de desarrollo web. Siempre responde como un humano cordial, guiando al usuario y tratando de convertirlo en cliente."
      }
    ];
  }

  // Agregar mensaje del usuario al historial
  sessions[sessionId].push({ role: "user", content: message });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: sessions[sessionId]
    });

    const reply = response.choices[0].message.content;

    // Guardar respuesta del bot al historial
    sessions[sessionId].push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error conectando con la IA" });
  }
});

// Endpoint opcional para reiniciar la sesión (historial limpio)
app.post("/reset-session", (req, res) => {
  const sessionId = req.headers["x-session-id"];
  if (sessionId && sessions[sessionId]) {
    delete sessions[sessionId];
  }
  res.json({ success: true });
});

// Levantar servidor en el puerto 3000
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));

// --- Session ID ---
let sessionId = localStorage.getItem("sessionId");
if (!sessionId) {
  sessionId = crypto.randomUUID();  // Genera un ID único para cada usuario
  localStorage.setItem("sessionId", sessionId);
}

// --- Chatbot Toggle ---
const chatbotButton = document.getElementById("chatbot-button");
const chatbotWindow = document.getElementById("chatbot-window");
const closeChat = document.getElementById("close-chat");

chatbotButton.addEventListener("click", () => {
  chatbotWindow.classList.toggle("hidden");
});

closeChat.addEventListener("click", () => {
  chatbotWindow.classList.add("hidden");
});

// --- Messaging ---
const sendBtn = document.getElementById("send-message");
const inputField = document.getElementById("chatbot-input");
const messages = document.getElementById("chatbot-messages");

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.textContent = text;

  if (sender === "user") {
    msg.classList.add("user");
  } else {
    msg.classList.add("bot");
  }

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {
  const userText = inputField.value.trim();
  if (!userText) return;

  addMessage("user", userText);
  inputField.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-session-id": sessionId   // Enviamos el sessionId
      },
      body: JSON.stringify({ message: userText })
    });

    const data = await res.json();
    addMessage("bot", data.reply);
  } catch (err) {
    console.error(err);
    addMessage("bot", "Error conectando con la IA");
  }
}

// Eventos
sendBtn.addEventListener("click", sendMessage);

inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// --- Resetear sesión si quieres un botón ---
const resetBtn = document.getElementById("reset-session");
if (resetBtn) {
  resetBtn.addEventListener("click", async () => {
    await fetch("/reset-session", {
      method: "POST",
      headers: {
        "x-session-id": sessionId
      }
    });
    localStorage.removeItem("sessionId");
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
    messages.innerHTML = "";
    addMessage("bot", "¡Hola! Soy CodeBot, tu asesor de Codelli Studio. ¿En qué puedo ayudarte?");
  });
}
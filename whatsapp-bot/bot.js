const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

console.log("🚀 Starting WhatsApp Bot...");

const BACKEND_URL = "https://social-saver-bot-4217.onrender.com";

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./session"
  }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu"
    ]
  }
});

client.on("qr", (qr) => {
  console.log("📲 Scan this QR:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp Bot Ready");
});

client.on("message", async (message) => {

  try {
    if (message.fromMe) return;
    if (message.from.endsWith("@g.us")) return;
    if (message.from === "status@broadcast") return;
    if (!message.body) return;

    const contact = await message.getContact();
    const phoneNumber = contact.number;

    // OTP reply handler
    const otpRegex = /^\d{6}$/;
    if (otpRegex.test(message.body.trim())) {
      await axios.post(`${BACKEND_URL}/verify-otp`, {
        phone: phoneNumber,
        otp: message.body.trim()
      });

      await message.reply("✅ OTP verified. You can now login.");
      return;
    }

    // Instagram link handler
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/(reel|p)\/.+/;

    if (!instagramRegex.test(message.body)) return;

    console.log("📌 Valid Instagram link:", message.body);

    const response = await axios.post(`${BACKEND_URL}/webhook`, {
      message: message.body,
      from_user: phoneNumber
    });

    await message.reply(response.data.ai_result);

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
});

client.initialize();
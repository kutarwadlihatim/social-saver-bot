const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

console.log("Starting WhatsApp Bot...");

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }
});

client.on('qr', (qr) => {
    console.log("QR RECEIVED");
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log("WhatsApp Bot Ready");
});

client.on('message', async (message) => {

    console.log("Incoming:", message.from, message.body);

    // 1️⃣ Ignore your own messages
    if (message.fromMe) return;

    // 2️⃣ Ignore groups
    if (message.from.endsWith("@g.us")) return;

    // 3️⃣ Ignore status broadcasts
    if (message.from === "status@broadcast") return;

    // 4️⃣ Ignore WhatsApp Channels (newsletter)
    if (message.from.includes("newsletter")) return;

    // 5️⃣ Ignore system messages
    if (!message.body) return;

    // 6️⃣ Only allow Instagram links
    const instagramRegex = /https?:\/\/(www\.)?instagram\.com\/(reel|p)\//;

    if (!instagramRegex.test(message.body)) return;

    console.log("Valid Instagram link:", message.body);

    try {

    const response = await axios.post("http://localhost:8000/webhook", {
        message: message.body,
        from_user: message.from
    });

    const aiReply = response.data.ai_result;

    await message.reply(aiReply);

} catch (error) {
    console.error("Backend error:", error.message);
    await message.reply("Something went wrong while processing.");
}
});

client.initialize();
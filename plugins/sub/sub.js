import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fff = async (m, { conn, text, cli }) => {
  m.react("🤖")
  const { subs } = require("../../system/sub.js");
  if (!subs) return m.reply("Sub system not ready yet");
  const list = subs.list() || [];
if (list.length >= 15) {
  await m.reply("العدد مكتمل");
  return;
}
  let digits = m.jid?.split("@")[0]?.replace(/\D/g, "");

  if (!digits) {
    digits = text?.trim().replace(/\D/g, "");
    if (!digits) return m.reply("❌: غلط انت مش معرفش jid اكتب الرقم احسن عشان تقدر تربطه. مثال: `.تنصيب 2010xxxxxx`");
  }

  if (subs.get(digits)?.connected) return m.reply(`🍏 الرقم مفعل بوت بالفعل: ${digits}`);

  const code = await subs.addBot(digits);
  if (!code) return m.reply("Failed to create pairing code");
const status = {
  key: {
    participant: `${m.sender.split('@')[0]}@s.whatsapp.net`,
    remoteJid: 'status@broadcast',
    fromMe: false,
  },
  message: {
    contactMessage: {
      displayName: `${m.pushName || 'User'}`,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${m.pushName || 'User'}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nEND:VCARD`,
    },
  },
  participant: "0@s.whatsapp.net",
}

await conn.buttonV2(m.chat, {
  text: `
> نـظـام الـبـوتـات الـفـرعـيـة 💐
  𑁍 ࣪ ִֶָ𓂃 ─ִ╾ׄ╾ ࣪ 𖹭 ࣪╾ִ╼ִ─ 𓂃ִֶָ ࣪ 𑁍
📱-- الرقم:  ${digits}
🔑 -- الكود:  ${code}
  𑁍 ࣪ ִֶָ𓂃 ─ִ╾ׄ╾ ࣪ 𖹭 ࣪╾ִ╼─ 𓂃ִֶָ ࣪ 𑁍
الكود ↢ الأجهزة المرتبطة ↢ الربط بكود 
> ملحوظة الكود بتنتهي صلاحيته بعد 15 ثانية تقريبا 
 ≽^ ˕ • ྀི≼`,
  footer: "𝐛𝐲 : 𝐕𝐈𝐈𝟕",
  image: cli.config.info.images[1],
  contextInfo: cli.config.info.channel,
  buttons: [
    {
      name: "cta_copy",
      buttonParamsJson: JSON.stringify({
        display_text: "𝐂𝐨𝐩𝐲",
        copy_code: code
      })
    }
  ],
  newsletter: {
    name:  "𝐕𝐈𝐈𝟕 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️",
    jid: "120363225356834044@newsletter"
  }
}, { quoted: status });

  for (let i = 0; i < 20; i++) {
    await sleep(3000);
    if (subs.get(digits)?.connected) {
      return conn.linkPreview(m.chat, {
      text: `✅ — *تـم الاتـصـال بـنـجـاح*\n\n📱 الرقم: ${digits}\n> *البوت جاهز للاستخدام الآن*`,
      url: image[0], 
      height: 438,
      width: 734,
      title: "𝐑 𝐄 𝐙 𝐄 — 𝐕𝐈𝐈7 🎀 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐌𝐄𝐎𝐖𝐒𝐀𝐁 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
      description: "𝙰 𝚋𝚘𝚝 𝚝𝚘 𝚝𝚎𝚜𝚝 𝚝𝚑𝚎 𝚗𝚎𝚠 𝚏𝚛𝚊𝚖𝚎𝚠𝚘𝚛𝚔"
    });
    }
  }

  await conn.sendMessage(m.chat, { text: "⏱️ Timeout" });
};

fff.command = ["تنصيب"];
fff.category = "subbots";
export default fff;
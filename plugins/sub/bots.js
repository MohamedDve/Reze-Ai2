
const bots = async (m, { conn }) => {
  const sub = globalThis.subBots;

  if (!sub) {
    return m.reply("مفيش بوتات فرعية.");
  }

  const list = await sub.list();

  if (!list.length) {
    return m.reply("مفيش بوتات فرعية.");
  }

  const connected = list.filter(bot => bot.connected).length;
  const disconnected = list.length - connected;

  const totalMessages = list.reduce(
    (total, bot) => total + (Number(bot.messages) || 0),
    0
  );

  const connectionRate = (
    (connected / list.length) * 100
  ).toFixed(1);

  const details = list.map((bot, i) => {
    return [
      `╭─「 ${i + 1}. ${bot.name || "بدون اسم"} 」`,
      `│ الرقم: ${bot.phone || "غير معروف"}`,
      `│ المعرّف: ${bot.id || "غير معروف"}`,
      `│ الحالة: ${bot.connected ? "🟢 متصل" : "🔴 غير متصل"}`,
      `│ الرسائل: ${Number(bot.messages) || 0}`,
      `╰────────────`
    ].join("\n");
  }).join("\n\n");

  const output = [
    "╭─「 إحصائيات البوتات 」",
    `│ إجمالي البوتات: ${list.length}`,
    `│ المتصلة: ${connected}`,
    `│ غير المتصلة: ${disconnected}`,
    `│ نسبة الاتصال: ${connectionRate}%`,
    `│ إجمالي الرسائل: ${totalMessages}`,
    "╰────────────",
    "",
    "「 تفاصيل البوتات 」",
    "",
    details
  ].join("\n");

  return m.reply(output);
};

bots.command = ["بوتات"];
bots.category = "subbots";
export default bots;

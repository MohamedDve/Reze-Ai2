const handler = async (m, { conn, args, command, cli, info }) => {
  const senderNum = m.sender.split("@")[0].split(":")[0];
  const status = {
    key: {
      participant: `${senderNum}@s.whatsapp.net`,
      remoteJid: "status@broadcast",
      fromMe: false,
    },
    message: {
      contactMessage: {
        displayName: `${m.pushName || "User"}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${m.pushName || "User"}\nitem1.TEL;waid=${senderNum}:${senderNum}\nEND:VCARD`,
      },
    },
    participant: "0@s.whatsapp.net",
  };

  const CATEGORIES = [
    [1, "التـحـمـيـل", "downloads", "📂"],
    [2, "الـمـجـمـوعـات", "group", "🐞"],
    [3, "الـمـلـصـقـات", "sticker", "🌄"],
    [4, "الـمـطـوريـن", "owners", "🇩🇪"],
    [5, "الادمــن", "admins", "👨🏻‍⚖️"],
    [6, "الالــعـاب", "games", "🎮"],
    [7, "الـتـرفـيـه والـمـرح", "fun", "🎭"],
    [8, "الـلـوجـو والـتـصـمـيـم", "logos", "🎨"],
    [9, "الـبـحـث", "search", "🔍"],
    [10, "الـذكـاء الاصـطـنـاعـي", "ai", "🤖"],
    [11, "الادوات والـتـحـويـلات", "tools", "🛠️"],
    [12, "الـبـوتـات الـفـرعـي", "sub", "♥️"],
    [13, "الـمـعـلـومـات", "info", "ℹ️"],
    [14, "الـالــقــاب", "nicknames", "🐞"],
    [15, "الـجـيـف", "gif", "🎞️"],
    [16, "الاصــوات", "voice", "🔊"],
    [17, "كـل الأوامـر", "all", "🪻"],
  ];

  const selected = parseInt(args[0]);

  if (!args[0]) {
    const sections = [
      {
        title: "🪻 ~ الاقـسـام ~ 🪻",
        rows: CATEGORIES.map((c) => ({
          title: `⦑ ${c[0]} ⦒ ⦂ ${c[1]} ${c[3]}`,
          description: `↳ اضغط لعرض ${c[2] === "all" ? "جميع أوامر البوت" : `أوامر قسم ${c[1]}`}`,
          id: `.${command} ${c[0]}`,
        })),
      },
    ];

    const menuText = `
رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ
وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِّلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَّحِيمٌ

  .─ִ╾ׄ─ִ─ִ╾ ࣪🪻.─ִ╾ׄ─ִ─ִ╾ ࣪
  
  *『 🪻 اهـلا → [ @${senderNum} ] 』*
  
  .─ִ╾ׄ─ִ─ִ╾ ࣪🪻.─ִ╾ׄ─ִ─ִ╾ ࣪

*🪻 ⇢ قـائـمـة الأوامـر*
_↳ اختار قسم من القائمة عشان يبعتلك اوامر القسم_`;

    await conn.buttonV3(
      m.chat,
      {
        image: "https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/1794253862863.jpg",
        text: menuText,
        footer: "reze ⇆ 𝐛𝐲 : 𝐕𝐈𝐈𝟕",
        buttons: [
          {
            name: "single_select",
            params: {
              title: "الاوامر",
              sections: sections,
            },
          },
          {
            name: "quick_reply",
            params: {
              display_text: "القناة",
              url: "https://whatsapp.com/channel/0029VaQim2bAu3aPsRVaDq3v",
            },
          },
        ],
        mentions: [m.sender],
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: status },
    );
    return;
  }

  const cat = CATEGORIES.find((c) => c[0] === selected);
  if (!cat) {
    await conn.sendMessage(
      m.chat,
      {
        text: `🪻: اختار رقم صحيح من 1 لـ ${CATEGORIES.length}`,
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: status },
    );
    return;
  }

  const cmds = await cli.commands();
  const categoryCmds = cmds.filter((c) => {
    const cmdList = Array.isArray(c.command) ? c.command : [c.command];
    if (cmdList.includes("اوامر") || cmdList.includes("menu")) return false;
    if (cat[2] === "all") return true;
    return c.category === cat[2];
  });

  const cmdsList = categoryCmds
    .flatMap((c) => {
      const rawUsage = c.usage ?? [];
      const list = Array.isArray(rawUsage) ? rawUsage : [rawUsage];
      return list
        .filter((u) => typeof u === "string" && u.trim())
        .map((cmd) => `⦑ ${cat[3]} ⦒ ⦂ .${cmd.trim().replace(/^[./]/, "")}`);
    })
    .join("\n");

  if (!cmdsList.length) {
    await conn.sendMessage(
      m.chat,
      { text: "🪻: القسم فاضي", contextInfo: cli?.config?.info?.channel },
      { quoted: status },
    );
    return;
  }

  const sectionText = `*⪩ ${cat[2] === "all" ? "كـل أوامـر الـبـوت" : `قـسـم ${cat[1]}`} ${cat[3]} ↯ •*
── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── 

${cmdsList}

── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── 
⦑ 🪻 ⦒ ⦂ ~ ${info?.nameBot || "Reze_bot"} ↜ ⟦ رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا ❤️ ⟧
> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`.trim();

  await conn.linkPreview(
    m.chat,
    {
      text: sectionText,
      url: "https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/1794253862863.jpg",
      height: 438,
      width: 734,
      title: "𝐑 𝐄 𝐙 𝐄 — 𝐕𝐈𝐈7 🪻 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐌𝐄𝐎𝐖𝐒𝐀𝐁 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
      description: cat[2] === "all" ? "قـائـمـة جـمـيـع أوامـر الـبـوت 🪻" : `قـائـمـة أوامـر قـسـم ${cat[1]} ${cat[3]}`,
    },
    { quoted: status },
  );
};

handler.command = ["اوامر", "menu"];
export default handler;
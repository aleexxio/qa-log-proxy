const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const app = express();
app.use(express.json({ limit: "1mb" }));

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1481991808753074176/Ue5xzRFBmnqJLwLRqzVtRWFDp2M69yABiI6KqyN8DHdAhI7Zj7Nk3ehgjusqtPPw1w-t";

app.post("/qalog", async (req, res) => {
  try {
    const data = req.body;

    // Description with only Submitted by
    const description = `**Submitted by**
${data.username}`;

    // Inline fields properly using Discord's inline feature
    const fields = [
      // Row 1
      { name: "**Avg. FPS**", value: `${data.fps}`, inline: true },
      { name: "**Place ID**", value: `${data.placeId}`, inline: true },
      { name: "**Players in Server**", value: `${data.playersInServer}`, inline: true },

      // Row 2
      { name: "**Player Cash**", value: `${data.cash}`, inline: true },
      { name: "**Player Device**", value: `${data.device}`, inline: true },
      { name: "**Player XP**", value: `Level ${data.level}`, inline: true },

      // Row 3
      { name: "**Server Version**", value: `${data.serverVersion}`, inline: true },
      { name: "**Server Region**", value: `${data.serverRegion}`, inline: true },
      { name: "**Server Created**", value: `<t:${data.serverCreated}:F>`, inline: true },

      // Spacer to start a new row
      { name: "\u200b", value: "\u200b", inline: false },

      // Non-inline fields below all inline stuff
      { name: "**Server ID**", value: `${data.serverId}`, inline: false },
      { name: "**In-Game Player Location**", value: `${data.location}`, inline: false }
    ];

    // Build form
    const form = new FormData();
    form.append(
      "payload_json",
      JSON.stringify({
        embeds: [
          {
            title: "QA Log",
            description: description,
            color: 0x000000, // black / no color
            fields: fields
          }
        ]
      })
    );

    // Attach console log as .txt
    form.append("file", Buffer.from(data.console), { filename: "console_log.txt" });

    await axios.post(DISCORD_WEBHOOK, form, { headers: form.getHeaders() });

    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to send QA log" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("QA Log proxy running"));

const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const app = express();
app.use(express.json({ limit: "1mb" }));

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1481991808753074176/Ue5xzRFBmnqJLwLRqzVtRWFDp2M69yABiI6KqyN8DHdAhI7Zj7Nk3ehgjusqtPPw1w-t"; // Replace with your webhook

app.post("/qalog", async (req, res) => {
  try {
    const data = req.body;

    const form = new FormData();
    form.append(
      "payload_json",
      JSON.stringify({
        embeds: [
          {
            description: `**Submitted by**\n${data.username}`,
            color: 5814783,
            fields: [
              { name: "**Avg. FPS**    **Place ID**     **Players in Server**", value: `${data.fps}        ${data.placeId}        ${data.playersInServer}`, inline: true },
              { name: "**Player Cash**   **Player Device**                                  **Player XP**", value: `${data.cash}           ${data.device}   Level ${data.level}`, inline: true },
              { name: "**Server Version**    **Server Region**    **Server Created**", value: `${data.serverVersion}            ${data.serverRegion}             <t:${data.serverCreated}:F>`, inline: true },
              { name: "**Server ID**", value: data.serverId },
              { name: "**In-Game Player Location**", value: data.location }
            ]
          }
        ]
      })
    );

    form.append("file", Buffer.from(data.console), { filename: "console_log.txt" });

    await axios.post(DISCORD_WEBHOOK, form, { headers: form.getHeaders() });

    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to send QA log" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("QA Log proxy running"));

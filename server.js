const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const app = express();
app.use(express.json({ limit: "1mb" }));

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1481991808753074176/Ue5xzRFBmnqJLwLRqzVtRWFDp2M69yABiI6KqyN8DHdAhI7Zj7Nk3ehgjusqtPPw1w-t";

app.post("/qalog", async (req, res) => {
  try {
    const data = req.body;

    // Hybrid embed format: inline vs single lines
    const embedDescription = `**Submitted by**
${data.username}

**Avg. FPS**    **Place ID**     **Players in Server**
${data.fps}        ${data.placeId}        ${data.playersInServer}

**Player Cash**   **Player Device**                                  **Player XP**
${data.cash}           ${data.device}   Level ${data.level}

**Server Version**    **Server Region**    **Server Created**
${data.serverVersion}            ${data.serverRegion}             <t:${data.serverCreated}:F>

**Server ID**
${data.serverId}

**In-Game Player Location**
${data.location}`;

    const form = new FormData();
    form.append(
      "payload_json",
      JSON.stringify({
        embeds: [
          {
            title: "QA Log",
            description: embedDescription,
            color: 0x000000 // black
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

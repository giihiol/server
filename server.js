
const express = require("express");
const cors = require("cors");
const app = express();

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

const used = new Map();

app.post("/ask", async (req, res) => {
  const vip = process.env.VIP_CODE &&
    req.body.code === process.env.VIP_CODE;

  if (!vip) {
    const n = used.get(req.ip) || 0;
    if (n >= 5) {
      return res.json({
        answer: "Xaddigu waa dhammaaday. Fur VIP."
      });
    }
    used.set(req.ip, n + 1);
  }

  try {
    const r = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [{
            role: "user",
            content: String(req.body.question || "").slice(0, 1000)
          }],
          max_tokens: 500
        })
      }
    );

    const d = await r.json();

    if (!r.ok) {
      console.error(d);
      return res.status(500).json({
        answer: "Khalad AI: hubi API Key-ga."
      });
    }

    res.json({
      answer: d.choices?.[0]?.message?.content || "Khalad"
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ answer: "Khalad server" });
  }
});

app.listen(process.env.PORT || 3000);

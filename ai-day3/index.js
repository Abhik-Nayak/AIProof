// index.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analyze", async (req, res) => {
    const { resumeText } = req.body;

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a professional recruiter.",
                },
                {
                    role: "user",
                    content: `
Analyze this resume.

Return JSON:
{
  "strengths": [],
  "weaknesses": [],
  "improvements": [],
  "score": number (0-100)
}

Resume:
${resumeText}
          `,
                },
            ],
            temperature: 0.3,
        });

        res.json({
            result: response.choices[0].message.content,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("Server running"));
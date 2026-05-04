import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


// THis endpoint is for analyze resume and JD .Give propper feed back
app.post("/analyze", async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
        return res.status(400).json({ error: "resumeText is required" });
    }

    const jobSection = jobDescription
        ? `\nJob Description:\n${jobDescription}`
        : "";

    const jobMatchSection = jobDescription
        ? `  "jobMatch": {
    "score": number (0-100),
    "matchedSkills": [],
    "missingSkills": []
  },`
        : "";

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content:
                        "You are a professional recruiter. Always respond with valid JSON only.",
                },
                {
                    role: "user",
                    content: `Analyze this resume and return a JSON object with exactly this structure:
{
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvements": ["string"],
  "missingSkills": ["string"],
  "score": number (0-100),${jobMatchSection}
  "summary": "string"
}

Resume:
${resumeText}${jobSection}`,
                },
            ],
            temperature: 0.3,
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        res.json({ result: parsed });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));

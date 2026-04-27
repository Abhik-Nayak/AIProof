import OpenAI from "openai";
import readlineSync from "readline-sync";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 👇 store conversation
let messages = [
  {
    role: "system",
    content:
      "You are a ruthless mentor. You speak directly and criticize weak ideas.",
  },
];

async function chat() {
  console.log("AI Chatbot (type 'exit' to quit and '/clear' to clear memory)");

  while (true) {
    const userInput = readlineSync.question("You: ");

    if (userInput.toLowerCase() === "exit") break;

    if (userInput.toLowerCase() === "/clear") {
      messages = [
        {
          role: "system",
          content: "You are a ruthless mentor.",
        },
      ];
      console.log("Memory cleared.");
      continue;
    }

    messages.push({ role: "user", content: userInput });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
    });

    console.log("Tokens used:", response.usage.total_tokens);

    const reply = response.choices[0].message.content;

    console.log("AI:", reply);

    // 👇 store AI response
    messages.push({ role: "assistant", content: reply });
  }
}

chat();

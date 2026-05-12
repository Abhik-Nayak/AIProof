import OpenAI from "openai";
import readlineSync from "readline-sync";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    try {
      const stream = await client.responses.stream({
        model: "gpt-5-mini",
        input: messages,
      });

      let fullReply = "";

      process.stdout.write("AI: ");

      for await (const event of stream) {
        if (event.type === "response.output_text.delta") {
          process.stdout.write(event.delta);
          fullReply += event.delta;
        }
      }

      console.log("\n");

      messages.push({ role: "assistant", content: fullReply });

    } catch (err) {
      console.log("Error:", err.message);
    }
  }
}

chat();
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno automáticamente
const modelo = 'claude-sonnet-4-0';

const message = await client.messages.create({
  model: modelo,
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "Que dia es hoy?"
    }
  ]
});
console.log("Contestacion" + message.content[0].text);
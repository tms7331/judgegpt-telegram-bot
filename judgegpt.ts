import { Bot, InlineKeyboard } from 'grammy';
import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const botKey = process.env.JUDGE_BOT_KEY;
if (botKey == undefined) {
  process.exit(1);
}
const chatgptKey = process.env.JUDGE_CHATGPT_KEY;
if (chatgptKey == undefined) {
  process.exit(1);
}

const bot = new Bot(botKey);
const openai = new OpenAI({apiKey: chatgptKey});

// Command listener for "/new"
bot.command('new', async (ctx: any) => {
  // Extract the command and arguments
  const text = ctx.message?.text || '';
  const args = text.split(' ').slice(1); // Get all words after the command

  if (args.length > 0) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'you are an assistance who responds like Dr Seuss' },
          { role: 'user', content: args.join(' ') }
        ],
        max_tokens: 50
      });
      ctx.reply(response.choices[0]?.message?.content);
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    ctx.reply('Please provide a text after the /new command.');
  }
});


bot.start();

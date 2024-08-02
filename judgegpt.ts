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
bot.command('new', (ctx: any) => {
  // Extract the command and arguments
  const text = ctx.message?.text || '';
  const args = text.split(' ').slice(1); // Get all words after the command

  if (args.length > 0) {
    // If there are arguments, echo them back
    const echoText = args.join(' ');
    ctx.reply(`You said: ${echoText}`);
  } else {
    ctx.reply('Please provide a text after the /new command.');
  }
});


bot.start();

import { Bot, InlineKeyboard } from 'grammy';
import OpenAI from "openai";

const bot = new Bot(bot_key);
const openai = new OpenAI(chatgpt_key);


// Command listener for "/new"
bot.command('new', (ctx) => {
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


import { Bot, InlineKeyboard } from 'grammy';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();


const botKey = process.env.BOT_KEY;
const chatgptKey = process.env.CHATGPT_KEY;
const bot = new Bot(botKey);
const openai = new OpenAI({ apiKey: chatgptKey });


type DataStore = Record<string, any>;

const dataStore: DataStore = {};

// Function to set data
function setData<T>(key: string, value: T): void {
  dataStore[key] = value;
}

// Function to get data
function getData<T>(key: string): T | undefined {
  return dataStore[key] as T | undefined;
}


async function main(inputStr: string) {
  const completion = await openai.chat.completions.create({
    messages: [{
      'role': 'system',
      'content': "You are an assistant who responds in the style of Dr Seuss."
    },
    {
      'role': 'user',
      'content': inputStr
    },
    ],
    model: "gpt-3.5-turbo",
  });
  console.log(completion.choices[0]);
  return completion.choices[0].message["content"];
}



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


bot.command('query', async (ctx) => {
  try {
    // Extract the command and arguments
    const text = ctx.message?.text || '';
    const args = text.split(' ').slice(1); // Get all words after the command

    if (args.length > 0) {
      // Make the asynchronous call
      const inpText = args.join(' ');
      const result = await main(inpText);
      // Reply with the result from the async function
      ctx.reply(`You said: ${result}`);
    } else {
      ctx.reply('Please provide a text after the /new command.');
    }
  } catch (error) {
    // Handle errors
    console.error('Error handling /query command:', error);
    ctx.reply('An error occurred while processing your request.');
  }
});



bot.start();


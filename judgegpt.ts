import { Bot } from 'grammy';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

const botKey = process.env.BOT_KEY;
const chatgptKey = process.env.CHATGPT_KEY;
const bot = new Bot(botKey!);
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



async function resolveDispute(descA: string, descB: string) {
  const completion = await openai.chat.completions.create({
    messages: [{
      'role': 'system',
      'content': "You are taking the role of a judge to resolve a dispute.  Two individuals will present their side of an argument and you have to decide who is right",
    },
    {
      'role': 'user',
      'content': "The first party says: " + descA + " The second party says: " + descB,
    },
    ],
    model: "gpt-3.5-turbo",
  });
  console.log(completion.choices[0]);
  return completion.choices[0].message["content"];
}



bot.command('new', (ctx) => {
  const text = ctx.match;
  const senderName = ctx.update["message"]?.from.username;
  const senderId = ctx.update["message"]?.from.id;

  // console.log(ctx);
  console.log(ctx.update["message"].from);
  console.log(senderName);
  console.log(senderId);

  const disputeCreator = { "senderName": senderName, "senderId": senderId, "disputeText": text };
  setData("creator", disputeCreator);

  if (text) {
    ctx.reply("Thank you for giving your side of the story, now please instruct your friend to use the /join command to provide their side of the story.");
  } else {
    ctx.reply('Please provide an explanation of what happened after the /new command.');
  }
});


bot.command('join', async (ctx) => {
  // So the text should already be in the data store

  const text = ctx.match;
  const senderName = ctx.update["message"]?.from.username;
  const senderId = ctx.update["message"]?.from.id;

  const disputeCreator = getData("creator");

  const result = await resolveDispute(disputeCreator!["disputeText"], text);
  const respText = `JudgeGPT's verdict: ${result}`;
  ctx.reply(respText);

  // And we also have to message the other person!
  await bot.api.sendMessage(disputeCreator!["senderId"], respText);
});


bot.start();

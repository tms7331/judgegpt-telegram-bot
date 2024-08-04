import { Bot } from 'grammy';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

const botKey = process.env.BOT_KEY;
const chatgptKey = process.env.CHATGPT_KEY;
const bot = new Bot(botKey!);
const openai = new OpenAI({ apiKey: chatgptKey });


type DataStore = Record<string, any>;

type Dispute = {
  senderName: string;
  senderId: number;
  disputeText: string;
};


const dataStore: DataStore = {};

function setData<T>(key: string, value: Dispute): void {
  dataStore[key] = value;
}
function popData<T>(key: string): Dispute | undefined {
  const data = dataStore[key] as Dispute | undefined;
  if (data !== undefined) {
    delete dataStore[key];
  }
  return data;
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


function buildNewArgumentKey(userA: string, userB: string) {
  // Sorts two users and concatenates them and returns the value
  const users = [userA, userB].sort();
  const retStr = users.join("_");
  return retStr;
}

function getUsernames(text: string) {
  const matches = text.match(/@\w+/g);
  return matches;
}


bot.command('start', async (ctx) => {
  const senderName = ctx.update["message"]?.from.username;
  const respText = `Greetings, @${senderName}! I am JudgeGPT, a bot that can help you resolve disputes.\n
To use me, send me a single message describing your dispute, you must include other person's telegram username in the message, in the format '@username'.\n
Then instruct them to do the same and I will provide a verdict based on both sides of the story.`;
  ctx.reply(respText);
});



bot.on('message', async (ctx) => {
  const text = ctx.message?.text;
  // Should we force them to put the other person's name first?
  // const otherName = text?.split(" ")[0];
  const senderName = ctx.update["message"]?.from.username;
  const senderId = ctx.update["message"]?.from.id;
  const otherNames = getUsernames(text!)
  if (!otherNames) {
    console.log("OTHER", otherNames);
    await ctx.reply("Please include the other person's telegram username in the message, in the format '@username'.");
  }
  else {
    const disputeKey = buildNewArgumentKey(senderName!, otherNames[0])
    // If the key is already there - we want to pop it and process the argument, otherwise store it
    const disputeCreator = popData(disputeKey);
    if (disputeCreator) {
      const result = await resolveDispute(disputeCreator["disputeText"], text!);
      const respText = `JudgeGPT's verdict: ${result}`;
      ctx.reply(respText);

      // And we also have to message the other person!
      await bot.api.sendMessage(disputeCreator["senderId"], respText);
    }
    else {
      const disputeCreator: Dispute = { "senderName": senderName!, "senderId": senderId, "disputeText": text! };
      setData(disputeKey, disputeCreator);
      await ctx.reply("Thank you for giving your side of the story, now please instruct your friend to provide their side of the story.");
    }
  }
});


bot.start();

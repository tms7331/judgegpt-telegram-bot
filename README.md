
# JudgeGPT

**JudgeGPT** is a Telegram bot project that settle disputes. Two users describe their sides of a dispute separately, and JudgeGPT will provide a judgment based on their inputs. It was built to experiment with the OpenAI and Telegram APIs.

## Usage

To try the bot, open the following URL on Telegram: [t.me/judgegpt_bot](https://t.me/judgegpt_bot). Once both parties have described their dispute, JudgeGPT will provide a judgment.  Note that you can try the bot on your own by providing your own username as the person you're disputing with.

## Running Locally

Before running your own instance of JudgeGPT, you need the following:

1. **OpenAI API Key**: Get an API key from OpenAI.
2. **Telegram Bot API Key**: Create a bot on Telegram and get the API key.
3. **Node and npm**: Ensure Node.js and npm are installed on your system.

Once you have these, follow these steps:

1. Clone the repository and navigate to the project directory.
2. Install the required packages by running:
`npm install`
3. Store your api keys in a .env file, copying the format in the env_example file
4. Compile the TypeScript code:
`npx tsc`
5. Run the bot:
`node dist/judgegpt.js`





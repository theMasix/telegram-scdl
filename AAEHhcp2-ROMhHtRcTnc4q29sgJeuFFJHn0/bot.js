const config = require('./config');

const Telegraf = require('telegraf');
const express = require('express');

const bot = new Telegraf(config.apiToken);
// Set the bot response
bot.start(ctx => {
  ctx.reply('Hello Masih');
});

let webhookURL = config.domain + config.folderName;
// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
bot.telegram.setWebhook(webhookURL);

const app = express();
app.get('/', (req, res) => res.send('It just works!'));
// Set the bot API endpoint
app.use(bot.webhookCallback('/' + config.folderName));
app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}!`);
});

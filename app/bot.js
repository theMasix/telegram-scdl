const config = require('./config');

const Telegraf = require('telegraf');
const express = require('express');

const bot = new Telegraf(config.apiToken);
// Set the bot response
bot.start(ctx => {
  ctx.reply('Hi');
});

// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
bot.telegram.setWebhook('https://scloud-dl-bot.herokuapp.com/app');

const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
// Set the bot API endpoint
app.use(bot.webhookCallback('/app'));
app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}!`);
});

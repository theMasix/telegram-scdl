const config = require('./config');
const messages = require('./messages');
const scdl = require('./scdl');
const Telegraf = require('telegraf');

const bot = new Telegraf(config.apiToken);
// Set the bot response
bot.start(ctx => {
  ctx.reply(messages.start);
});
bot.on('text', ctx => {
  scdl
    .getTrackInfo(ctx.message.text)
    .then(trackInfo => {
      return ctx.replyWithAudio({ source: trackInfo.url });
    })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
});

// let webhookURL = config.domain + `:` + config.port + config.folderName;
let webhookURL = config.domain + `:` + config.port;
// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
bot.telegram.setWebhook(webhookURL);
console.log(`webhook has set to ${webhookURL}`);

module.exports = bot;

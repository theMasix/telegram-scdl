const config = require('./config');
const messages = require('./messages');
const scdl = require('./scdl');
const Telegraf = require('telegraf');
const isURL = require('is-url');

const bot = new Telegraf(config.apiToken);
// Set the bot response
bot.start(ctx => {
  ctx.reply(messages.start);
});
bot.on('text', ctx => {
  let userMessage = ctx.message.text;

  if (!isURL(userMessage)) {
    ctx.reply('This is not a valid soundcloud url.');
    return console.log(`${userMessage} was not valid url.`);
  }

  // If the message was url
  try {
    ctx.reply('start process');
    scdl
      .getTrackInfo(userMessage)
      .then(trackInfo => {
        ctx.reply('process 1');
        return ctx.replyWithAudio({ source: trackInfo.url });
      })
      .then(result => {
        ctx.reply('process 2');
        console.log(result);
      })
      .catch(err => {
        ctx.reply('an Error occured in getting trackinfo:');
        ctx.replyWithMarkdown(err);
        console.log(err);
      });
  } catch (e) {
    ctx.reply('catch scope');
    console.log(e.message);
  }
});

let webhookURL = config.domain + config.routingAddress;

// Set telegram webhook
bot.telegram.setWebhook(webhookURL);
console.log(`webhook has set to ${webhookURL}`);

module.exports = bot;

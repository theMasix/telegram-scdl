// const config = require('./config');
const config = {
  port: 5656,
  apiToken: '811208007:AAEHhcp2-ROMhHtRcTnc4q29sgJeuFFJHn0'
};

const telegraf = require('telegraf');
const bot = new telegraf(config.apiToken);

bot.start(ctx => {
  ctx.reply('Welcome');
});
bot.launch();

console.log('Bot is working!');

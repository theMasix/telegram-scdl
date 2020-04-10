const config = require('./config');
const scdl = require('./scdl');
const messages = require('./messages');
const utils = require('./utils');
const Telegraf = require('telegraf');

const userActions = require('./database/userActions');

// TODO: delete track after sending to telegram
// TODO: grab and send all messages from messages.js
// TODO: sending file larger than 50MB IMPORTANT

let webhookURL = config.domain + config.routingAddress;

const bot = new Telegraf(config.apiToken, {
  // If I delete the webhookReply: false then the first ctx reply in on('text') method would return something else than telegram message
  // For more information see:  https://github.com/telegraf/telegraf/issues/784
  telegram: {
    webhookReply: false
  }
});
// Set the bot response
bot.start(async ctx => {
  let user = ctx.chat;
  ctx.reply(messages.start);

  // Creating User or updating the updatedAt
  await userActions.createUser(user);
});
bot.on('text', async ctx => {
  let userMessage = ctx.message.text;
  let lastMessage = null;

  let user = ctx.chat;

  if (user.id != 87679709) {
    console.log(`${user.id} messaged`);
    await ctx.reply('The Bot is being repaired. Please come back tommorow');
    return;
  }

  try {
    await userActions.insertNewMessage(user, userMessage);

    // Checking the url to be valid
    let trackLink = utils.extractTrackLink(userMessage);

    if (!trackLink) {
      ctx.reply('Your sent message contains no valid soundcloud url.');
      return console.log(`${userMessage} contains no valid track URL`);
    }

    // See comment on telegraf consturctor
    lastMessage = await ctx.reply('process is starting ...');

    let trackInfo = await scdl.getTrackInfo(trackLink);

    let isURLPlaylist = utils.isURLPlaylist(trackInfo.url);

    // If the link is playlist, it will be m3u8 stream file, otherwise it's the mp3 file
    if (!isURLPlaylist) {
      // We can directly sent url to telegram
      trackInfo.downloadLink = trackInfo.url;
    } else {
      // Let's download track locally

      // Create random name
      let musicName = `${Math.floor(Math.random() * 1000)}.mp3`;

      // TrackURL for Telegram
      // config.domain containes / at the end
      let trackURL = `${config.domain}download/${musicName}`;

      // add track url to trackInfo
      trackInfo.downloadLink = trackURL;

      lastMessage = await ctx.telegram.editMessageText(
        lastMessage.chat.id,
        lastMessage.message_id,
        undefined,
        'downloading track(s) to our servers ...'
      );

      await utils.downloadTrackLocally(trackInfo.url, musicName);
    }

    lastMessage = await ctx.telegram.editMessageText(
      lastMessage.chat.id,
      lastMessage.message_id,
      undefined,
      'Enjoy! here is your track:'
    );

    // Send track to user
    // console.log(trackInfo);
    await ctx.replyWithAudio({
      url: trackInfo.downloadLink,
      filename: trackInfo.fullTitle
    });

    // update downloaded track count
    await userActions.updateDownloadedTrack(user);
  } catch (e) {
    ctx.reply('an Error occured. Please contact @TheMasix');
    console.log(e.message);
  }
});

// Set telegram webhook
bot.telegram.setWebhook(webhookURL);
console.log(`webhook has set to ${webhookURL}`);

module.exports = bot;

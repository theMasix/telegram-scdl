const config = require('./config');
const scdl = require('./scdl');
const messages = require('./messages');
const utils = require('./utils');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const userActions = require('./database/userActions');

// TODO: grab and send all messages from messages.js
// TODO: sent caption and more information while sending the music to the user

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
        'downloading track to our servers ...'
      );

      await utils.downloadPlaylistLocally(trackInfo.url, musicName);
    }

    lastMessage = await ctx.telegram.editMessageText(
      lastMessage.chat.id,
      lastMessage.message_id,
      undefined,
      'Enjoy! here is your track:'
    );

    // Send track to user
    // We catch it in anoter way
    try {
      await ctx.replyWithAudio({
        url: trackInfo.downloadLink,
        filename: trackInfo.fullTitle
      });
    } catch (res) {
      // If an error occure in here, then the general catch will raise.

      if (res.code == 413) {
        // Handling the large file size problem.

        // get the link which downloaded to telegram
        let downloadURL = res.on.payload.audio.url;

        // Inline keyboard
        const keyboard = Markup.inlineKeyboard([
          Markup.urlButton('Download Track', downloadURL)
        ]);

        lastMessage = await ctx.telegram.editMessageText(
          lastMessage.chat.id,
          lastMessage.message_id,
          undefined,
          'Large file size tracks can only be downloaded via the direct link.',
          Extra.markup(keyboard)
        );

        ctx.reply('If there is any issue, please contact @TheMasix');
      } else {
        throw e;
      }
    }

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

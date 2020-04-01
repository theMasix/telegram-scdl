const config = require('./config');
const messages = require('./messages');
const scdl = require('./scdl');
const Telegraf = require('telegraf');
const isURL = require('is-url');
const m3u8stream = require('m3u8stream');
const fs = require('fs');

let webhookURL = config.domain + config.routingAddress;

const bot = new Telegraf(config.apiToken);
// Set the bot response
bot.start(ctx => {
  ctx.reply(messages.start);
});
bot.on('text', ctx => {
  let userMessage = ctx.message.text;
  let lastMessage = null;

  if (!isURL(userMessage)) {
    ctx.reply('This is not a valid soundcloud url.');
    return console.log(`${userMessage} was not valid url.`);
  }

  // If I comment this, then the next ctx.reply won't work!
  ctx.reply('process is starting ...');

  // If the message was url
  try {
    scdl
      .getTrackInfo(userMessage)
      .then(trackInfo => {
        return new Promise(resolve => {
          // let musicName = `${trackInfo.fullTitle}.mp3`;
          // Create random name
          let musicName = `${Math.floor(Math.random() * 1000)}.mp3`;

          playlistRegex = /playlist/gi;
          isURLPlaylist = playlistRegex.test(trackInfo.url);

          // If the link is playlist, it will be m3u8 stream file, otherwise it's the mp3 file
          if (!isURLPlaylist) {
            // We can directly sent url to telegram
            trackInfo.downloadLink = trackInfo.url;
            return resolve(trackInfo);
          } else {
            // TrackURL for Telegram
            // config.domain containes / at the end
            let trackURL = `${config.domain}download/${musicName}`;

            // add track url to trackInfo
            trackInfo.downloadLink = trackURL;

            // Download trackinfo
            let download = m3u8stream(trackInfo.url).pipe(
              // Track will be downloaded out of the src folder
              fs.createWriteStream(`./${musicName}`)
            );
            download.on('open', async () => {
              lastMessage = await ctx.reply(
                'downloading track(s) to our servers.'
              );
            });
            download.on('close', async () => {
              lastMessage = await ctx.telegram.editMessageText(
                lastMessage.chat.id,
                lastMessage.message_id,
                undefined,
                'track downloaded to our servers.'
              );
              return resolve(trackInfo);
            });
          }
        });
      })
      .then(trackInfo => {
        if (lastMessage) {
          lastMessage = ctx.telegram.editMessageText(
            lastMessage.chat.id,
            lastMessage.message_id,
            undefined,
            'Enjoy! here is your track:'
          );
        } else {
          ctx.reply('Enjoy! here is your track:');
        }
        // Send to user
        ctx.replyWithAudio({
          url: trackInfo.downloadLink,
          filename: trackInfo.fullTitle
        });
      })
      .catch(err => {
        ctx.reply(err.meesage);
        console.log(err.message);
      });
  } catch (e) {
    ctx.reply('catch scope');
    console.log(e.message);
  }
});

// Set telegram webhook
bot.telegram.setWebhook(webhookURL);
console.log(`webhook has set to ${webhookURL}`);

module.exports = bot;

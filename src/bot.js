const config = require('./config');
const messages = require('./messages');
const scdl = require('./scdl');
const Telegraf = require('telegraf');
const urlParse = require('url-parse');
const m3u8stream = require('m3u8stream');
const fs = require('fs');
const UserModel = require('./database/usermodel');

// TODO: delete track after sending to telegram
// There is no music after sending it to user! don't know why ...

// TOOD: grab and send all messages from messages.js

let webhookURL = config.domain + config.routingAddress;

const bot = new Telegraf(config.apiToken, {
  // If I delete the webhookReply: false then the first ctx reply in on('text') method would return something else than telegram message
  // For more information see:  https://github.com/telegraf/telegraf/issues/784
  telegram: { webhookReply: false }
});
// Set the bot response
bot.start(ctx => {
  ctx.reply(messages.start);

  let user = ctx.chat;

  // Creating User or updating the updatedAt
  let userData = {
    chat_id: user.id,
    username: user.username,
    name: user.first_name,
    updatedAt: new Date()
  };
  let updateOptions = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  };
  UserModel.findOneAndUpdate(
    { chat_id: user.id },
    userData,
    updateOptions
  ).catch(err => {
    console.error(err.message);
  });
});
bot.on('text', async ctx => {
  let userMessage = ctx.message.text;
  let lastMessage = null;

  let user = ctx.chat;

  try {
    // Update user data and track urls in database
    let updateTrackUrls = {
      chat_id: user.id,
      username: user.username,
      name: user.first_name,
      updatedAt: new Date(),
      $push: {
        trackUrls: {
          trackLink: userMessage, // This is the raw message that user provided
          date: new Date()
        }
      }
    };
    await UserModel.findOneAndUpdate({ chat_id: user.id }, updateTrackUrls);

    // Extract exact track link from user message for further usage. also it'll save on Database
    const extractLinkRegex = /(http(s)?:\/\/)?(m\.)?soundcloud\.com(\S*)/i;
    let extractLink = userMessage.match(extractLinkRegex);

    // Checking the url
    if (!extractLink) {
      ctx.reply('Your sent message contains no valid soundcloud url.');
      return console.log(`${userMessage} contains no valid track URL`);
    }
    // Now we can get the exact url
    let trackLink = extractLink[0];

    // See comment on telegraf consturctor
    lastMessage = await ctx.reply('process is starting ...');

    scdl
      .getTrackInfo(trackLink)
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
              lastMessage = await ctx.telegram.editMessageText(
                lastMessage.chat.id,
                lastMessage.message_id,
                undefined,
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
      .then(async trackInfo => {
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
        await ctx.replyWithAudio({
          url: trackInfo.downloadLink,
          filename: trackInfo.fullTitle
        });
      })
      .then(() => {
        // Update downloaded track count (secceed delivered track)
        let updateDownloadedTrack = {
          updatedAt: new Date(),
          $inc: {
            downloadedTracks: 1
          }
        };
        return UserModel.findOneAndUpdate(
          { chat_id: user.id },
          updateDownloadedTrack
        );
      })
      .catch(err => {
        ctx.reply(err.meesage);
        console.log(err.message);
      });
  } catch (e) {
    ctx.reply('an Error occured');
    console.log(e.message);
  }
});

// Set telegram webhook
bot.telegram.setWebhook(webhookURL);
console.log(`webhook has set to ${webhookURL}`);

module.exports = bot;

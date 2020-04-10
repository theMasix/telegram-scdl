const fs = require('fs');
const m3u8stream = require('m3u8stream');
// const axios = require('axios');

const utils = {};

// Extract exact track link from user message
utils.extractTrackLink = userMessage => {
  const extractLinkRegex = /(http(s)?:\/\/)?(m\.)?soundcloud\.com(\S*)/i;
  let extract = userMessage.match(extractLinkRegex);

  if (extract instanceof Array) {
    return extract[0];
  } else {
    return false;
  }
};

utils.isURLPlaylist = url => {
  playlistRegex = /playlist/gi;
  return playlistRegex.test(url);
};

// Download playlist with m3u8
utils.downloadPlaylistLocally = (url, musicName) => {
  return new Promise(resolve => {
    // Download trackinfo
    let download = m3u8stream(url).pipe(
      // Track will be downloaded out of the src folder
      fs.createWriteStream(`./${musicName}`)
    );
    download.on('close', () => resolve());
  });
};

// We send the youtube-dl link to the user directly
// Download long tracks
// utils.downloadLongTrackLocally = async (trackURL, musicName) => {
//   console.log(trackURL);

//   let file = await axios({
//     url: trackURL,
//     method: 'GET',
//     responseType: 'stream'
//   });

//   let writer = fs.createWriteStream(musicName);

//   file.data.pipe(writer);

//   return new Promise((resolve, reject) => {
//     writer.on('finish', resolve);
//     writer.on('error', reject);
//   });
// };

module.exports = utils;

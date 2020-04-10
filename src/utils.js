const fs = require('fs');
const m3u8stream = require('m3u8stream');

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

utils.downloadTrackLocally = (url, musicName) => {
  return new Promise(resolve => {
    // Download trackinfo
    let download = m3u8stream(url).pipe(
      // Track will be downloaded out of the src folder
      fs.createWriteStream(`./${musicName}`)
    );
    download.on('close', () => resolve());
  });
};

module.exports = utils;

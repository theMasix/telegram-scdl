const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf-8');
let { spawn } = require('child_process');

let scdl = {};
scdl.getTrackInfo = url => {
  return new Promise((resolve, reject) => {
    let options = ['-o', '%(uploader)s - %(title)s.%(ext)s', '-j', url];

    try {
      let process = spawn('youtube-dl', options);
      let buffer = '';
      process.stdout.on('data', data => {
        // console.log('data');
        buffer += decoder.write(data);
      });
      process.stdout.on('end', () => {
        buffer += decoder.end();
        let parse = JSON.parse(buffer);

        let link = parse.url;
        // TODO: Getting the bset download link
        // Get the best download link of a track
        // for (audio of parse.formats) {
        //   // console.log(audio);
        //   if (audio.abr === 128) {
        //     link = audio.url;
        //     if (audio.protocol === 'http' || audio.protocol === 'https') {
        //       return;
        //     }
        //   }
        // }

        let trackName = parse.uploader + ' - ' + parse.fulltitle;

        let result = {
          scUrl: url, // url that user provided
          url: link, // Comes from youtube-dl
          downloadLink: '',
          trackName: trackName,
          thumbnail: parse.thumbnail,
          fullTitle: parse.fulltitle,
          uploader: parse.uploader
        };
        resolve(result);
      });

      process.on('error', err => {
        reject(err.message);
      });
    } catch (e) {
      reject(e.message);
    }
  });
};

module.exports = scdl;

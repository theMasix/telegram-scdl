const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf-8');
let { spawn } = require('child_process');

let scdl = {};
scdl.getTrackInfo = url => {
  return new Promise((resolve, reject) => {
    let options = ['-o', '%(uploader)s - %(title)s.%(ext)s', '-j', url];

    try {
      let process = spawn('youtube-dl', options);
      let buffer = ''; //soundcloud.com/user-349126635/sets/aerophonia

      /* We get the data once and kill process after it
       * If we get data here and then process it on 'end' event, an error may occure.
       * i.e for this track:
       */

      process.stdout.on('data', data => {
        // kill the process and do not get data anymore
        process.kill();

        buffer += decoder.write(data);
        buffer += decoder.end();

        let parse = JSON.parse(data);

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

        let result = {
          scUrl: url, // url that user provided
          url: link, // Comes from youtube-dl
          downloadLink: '',
          thumbnail: parse.thumbnail,
          fullTitle: parse.fulltitle,
          uploader: parse.uploader
        };
        return resolve(result);
      });

      process.on('error', err => {
        reject(err.message);
      });
    } catch (err) {
      reject(err.message);
    }
  });
};

module.exports = scdl;

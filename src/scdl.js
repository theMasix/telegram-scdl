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
        buffer += decoder.end();
        let parse = JSON.parse(buffer);
        let trackName = parse.uploader + ' - ' + parse.fulltitle;

        let result = {
          scUrl: url, // url that user provided
          url: parse.url, // Comes from youtube-dl
          downloadLink: '',
          trackName: trackName,
          thumbnail: parse.thumbnail,
          fullTitle: parse.fulltitle,
          uploader: parse.uploader
        };
        return resolve(result);
      });
      process.stdout.on('end', () => {
        // console.log('end');
      });

      process.on('error', err => {
        reject(err);
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = scdl;

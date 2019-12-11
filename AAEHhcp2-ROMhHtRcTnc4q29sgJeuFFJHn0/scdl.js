const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf-8');
let spawn = require('child_process').spawn;

let scdl = {};
scdl.getTrackInfo = url => {
  return new Promise((resolve, reject) => {
    let options = ['-o', '%(uploader)s - %(title)s.%(ext)s', '-j', url];
    let process = spawn('youtube-dl', options);

    let buffer = '';
    process.stdout.on('data', data => {
      buffer += decoder.write(data);
    });
    process.stdout.on('end', () => {
      buffer += decoder.end();
      let parse = JSON.parse(buffer);
      let trackName = parse.uploader + ' - ' + parse.fulltitle;

      let result = {
        url: parse.url,
        trackName: trackName,
        thumbnail: parse.thumbnail
      };
      return resolve(result);
    });
  });
};

module.exports = scdl;

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf-8');

let spawn = require('child_process').spawn;
// let process = spawn('python', ['./test.py']);
let link = 'https://soundcloud.com/simplythree/counting-stars';
let options = ['-o', '%(uploader)s - %(title)s.%(ext)s', '-j', link];
let process = spawn('youtube-dl', options);

let buffer = '';
process.stdout.on('data', data => {
  buffer += decoder.write(data);
});
process.stdout.on('end', () => {
  buffer += decoder.end();
  let result = JSON.parse(buffer);
  console.log(result.url);
  console.log(result._filename);
  console.log(result.uploader);
  console.log(result.fulltitle);
  console.log(result.thumbnail);
});

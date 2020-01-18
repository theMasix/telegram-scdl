const config = require('./config');
const bot = require('./bot');
const fs = require('fs');
const express = require('express');
const https = require('https');

const key = fs.readFileSync('./ssl/key.pem');
const cert = fs.readFileSync('./ssl/cert.pem');

const app = express();
app.get('/', (req, res) => {
  console.log('packet recieved!');
  res.send('It just works!');
});
// Set the bot API endpoint
app.use(bot.webhookCallback('/' + config.folderName));

const server = https.createServer({ key: key, cert: cert }, app);
server.listen(config.port, () => {
  console.log(`https server is listening on ${config.port}`);
});

const dotenv = require('dotenv');
dotenv.config();

let config = {
  apiToken: process.env.API_TOKEN,
  port: process.env.PORT,
  folderName: 'AAEHhcp2-ROMhHtRcTnc4q29sgJeuFFJHn0',
  domain: 'https://scloud-dl-bot.herokuapp.com/'
};

module.exports = config;

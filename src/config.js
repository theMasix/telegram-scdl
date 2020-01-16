const dotenv = require('dotenv');
dotenv.config();

let config = {
  apiToken: process.env.API_TOKEN,
  port: process.env.PORT,
  folderName: 'src',
  domain: 'https://194.5.192.48/'
};

module.exports = config;

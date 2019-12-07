const dotenv = require('dotenv');
dotenv.config();

let config = {
  apiToken: process.env.API_TOKEN,
  port: process.env.PORT
};

module.exports = config;

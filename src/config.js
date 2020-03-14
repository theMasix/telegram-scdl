const dotenv = require('dotenv');
dotenv.config();

let config = {
  apiToken: process.env.API_TOKEN,
  port: process.env.PORT,
  routingAddress: process.env.ROUTING_ADDRESS,
  domain: process.env.DOMAIN
};

module.exports = config;

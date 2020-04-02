const dotenv = require('dotenv');
dotenv.config();

let config = {
  apiToken: process.env.API_TOKEN,
  port: process.env.PORT,
  routingAddress: process.env.ROUTING_ADDRESS,
  domain: process.env.DOMAIN,
  // These are the cloud.mongodb.com credentials
  mongoDBUsername: process.env.MONGODB_USERNAME,
  mongoDBPassword: process.env.MONGODB_PASSWORD
};

module.exports = config;

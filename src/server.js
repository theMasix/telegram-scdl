const config = require('./config');
const bot = require('./bot');
const express = require('express');

const app = express();
app.get('/', (req, res) => {
  console.log('packet recieved!');
  res.send('It just works!');
});
// Set the bot API endpoint
app.use(bot.webhookCallback('/' + config.routingAddress));

app.listen(config.port, () => {
  console.log(`server is listening on ${config.port}`);
});

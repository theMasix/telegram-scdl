const config = require('./config');
const fs = require('fs');
const bot = require('./bot');
const express = require('express');

const app = express();
app.get('/download/:filename', (req, res) => {
  let filename = req.params.filename;
  const fileAddress = `/home/node/app/${filename}`;
  try {
    res.download(fileAddress, err => {
      if (err) {
        console.log(err.message);
      }
      res.end();

      fs.unlink(fileAddress, err => {
        if (err) throw err;
      });
    });
  } catch (e) {
    console.log(e.message);
  }
});
// Set the bot API endpoint
app.use(bot.webhookCallback('/' + config.routingAddress));

app.listen(config.port, () => {
  console.log(`server is listening on ${config.port}`);
});

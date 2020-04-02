const config = require('../config');
const mongoose = require('mongoose');

const dbPath = `mongodb+srv://${config.mongoDBUsername}:${config.mongoDBPassword}@telegram-scdl-4xfkf.mongodb.net/test?retryWrites=true&w=majority`;

mongoose
  .connect(dbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true
  })
  .then(() => {
    console.log('Databse connected');
  })
  .catch(err => {
    console.log(`Connection Error: ${err.message}`);
  });

module.exports = mongoose;

// Here I write database actions.

const UserModel = require('./userModel');

const actions = {};

actions.createUser = user => {
  // Creating User or updating the updatedAt
  let userData = {
    chat_id: user.id,
    username: user.username,
    name: user.first_name,
    updatedAt: new Date()
  };
  let updateOptions = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  };
  return UserModel.findOneAndUpdate(
    { chat_id: user.id },
    userData,
    updateOptions
  );
};

actions.insertNewMessage = (user, userMessage) => {
  // Update user data and track urls in database
  let updateTrackUrls = {
    chat_id: user.id,
    username: user.username,
    name: user.first_name,
    updatedAt: new Date(),
    $push: {
      trackUrls: {
        trackLink: userMessage, // This is the raw message that user provided
        date: new Date()
      }
    }
  };
  return UserModel.findOneAndUpdate({ chat_id: user.id }, updateTrackUrls);
};

actions.updateDownloadedTrack = user => {
  // Update downloaded track count (secceed delivered track)
  let data = {
    updatedAt: new Date(),
    $inc: {
      downloadedTracks: 1
    }
  };

  return UserModel.findOneAndUpdate({ chat_id: user.id }, data);
};

module.exports = actions;

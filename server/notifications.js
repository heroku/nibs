var request = require('request'),
  winston = require('winston');

var tokens = [];

function sendNotifications() {
  winston.info("sending to " + tokens.toString());
  var options = {
    uri: 'https://api.ionic.io/push/notifications',
    method: 'POST',
    headers: [
      {name: 'Authorization', value: 'Bearer ' + process.env.IONIC_API_TOKEN }
    ],
    json: {
      tokens: tokens,
      profile: "test",
      notification: {
        message: "This is my demo push!"
      }
    }
  }

  function callback(error, response, body) {
    if (!error ) {
      winston.info("Response status:", response.statusCode);
      winston.info("body: " + body);
    }
  }

  request(options, callback);
}

function register(req, res, next) {
  var token = req.params.token;
  tokens.push(token);
  winston.info("registered " + token);
  res.send(201);
}

exports.sendNotifications = sendNotifications;
exports.register = register;

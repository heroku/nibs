var request = require('request'),
  winston = require('winston'),
  db = require('./pghelper'),
  config = require('./config');

var tokens = [];

function searchOffers() {
  return db.query("SELECT name FROM salesforce.campaign WHERE type='Offer' AND status='In Progress' AND 	eitech__notifiable__c  ");
}

function sendNotification(offerName) {
  var options = {
    uri: 'https://api.ionic.io/push/notifications',
    method: 'POST',
    headers: {'Authorization': 'Bearer ' + config.ionicApiToken },
    json: {
      tokens: tokens,
      profile: "test",
      notification: {
        message: "New offer: " + offerName.name
      }
    }
  }

  function callback(error, response, body) {
    if (!error ) {
      winston.info("Response status:", response.statusCode);
      winston.info("body: " + JSON.stringify(body));
    }
  }

  request(options, callback);
}

function sendNotifications() {
  if(tokens.length == 0) {
    winston.info("nobody to send to");
    return;
  }

  winston.info("sending to", tokens.toString());
  searchOffers().then(function(names) {
    names.forEach(sendNotification);
  });

}

function register(req, res, next) {
  var token = req.params.token;
  tokens.push(token);
  winston.info("registered " + token);
  res.send(201);
}

exports.sendNotifications = sendNotifications;
exports.register = register;

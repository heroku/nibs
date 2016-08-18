var request = require('request'),
  winston = require('winston'),
  db = require('./pghelper'),
  config = require('./config');

var tokens = [];

function searchOffers() {
  return db.query("SELECT name, eitech__sequential_number__c as seqnumber FROM salesforce.campaign WHERE type='Offer' AND status='In Progress' AND 	eitech__notifiable__c ORDER BY eitech__sequential_number__c ");
}

function sendNotification(offerName) {
  function filterFunction(i) {
    return function (tokenObject) {
      return tokenObject.seqNumber <i;
    }
  }
  var filteredTokens = tokens.filter(filterFunction(offerName.seqnumber));
  var tokenValues = filteredTokens.map(function(tokenObject) {return tokenObject.token});
  filteredTokens.forEach(function(tokenObject){
    tokenObject.seqNumber = offerName.seqnumber;
  });

  winston.info("Updated tokens:", JSON.stringify(tokens));

  if(tokenValues.length > 0) {
    var options = {
      uri: 'https://api.ionic.io/push/notifications',
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + config.ionicApiToken },
      json: {
        tokens: tokenValues,
        profile: "test",
        notification: {
          title: "New offer",
          message: offerName.name,
          android: {
            message: offerName.name,
            payload: {seqNumber: offerName.seqnumber }
          }
        }
      }
    }

    function callback(error, response, body) {
      if (!error ) {
        winston.info("Response status:", response.statusCode);
        winston.info("body: " + JSON.stringify(body));
      } else {
        winston.error("Error sending push: " + JSON.stringify(error));
      }
    }

    request(options, callback);
  } else {
    winston.info("No one to send " + offerName.seqnumber);
  }

}

function sendNotifications() {
  if(tokens.length == 0) {
    winston.info("nobody to send to");
    return;
  }


  searchOffers().then(function(names) {
    names.forEach(sendNotification);
  });

}

function register(req, res, next) {
  var token = req.params.token;
  var seqNumber = req.params.seqnumber;
  tokens.push({token: token, seqNumber: seqNumber });
  if(tokens.length > 20) {
    tokens.shift();
  }
  winston.info("registered " + token);
  return res.send(201);
}

function reset(req, res, next) {
  var token = req.params.token;
  var filteredTokens = tokens.filter(function(elt) {return elt.token == token});
  if(filteredTokens.length > 0) {
    filteredTokens[0].seqNumber = 0;
  }
  return res.send(204);
}

exports.sendNotifications = sendNotifications;
exports.register = register;
exports.reset = reset;

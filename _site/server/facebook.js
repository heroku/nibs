/*
 * Facebook Login Module
 * Provides functions to log in to the application as a Facebook user
 */

var winston = require("winston"),
    Q = require('q'),
    auth = require('./auth'),
    db = require('./pghelper'),
    config = require('./config'),
    https = require('https');

function login(req, res, next) {

    var fbUser = req.body.user,
        fbToken = req.body.token;

    function createAndSendToken(user) {
        console.log('send token for user:' + JSON.stringify(user));
        auth.createAccessToken(user)
            .then(function(token) {
                var response = {'user':{'email': user.email, 'firstName': user.firstname, 'lastName': user.lastname}, 'token': token};
                winston.info(JSON.stringify(response));
                return res.send(response);
            })
            .catch(next);
    }

    // Check if Facebook token is valid and matches the Facebook User id provided.
    validateFacebookToken(fbToken, fbUser.id)
        .then(function () {
            // The Facebook token is valid
            db.query('SELECT id, firstName, lastName, email, loyaltyid__c as externalUserId FROM salesforce.contact WHERE fbUserId__c=$1', [fbUser.id], true)
                .then(function (user) {
                    if (user) {
                        // The Facebook user is known
                        // Create a token and send it to the client.
                        winston.info('Known Facebook user');
                        return createAndSendToken(user);
                    } else {
                        db.query('SELECT id, firstName, lastName, email FROM salesforce.contact WHERE email=$1', [fbUser.email], true)
                            .then(function (user) {
                                if (user) {
                                    // We already have a user with that email address
                                    // Add Facebook id to user record
                                    winston.info('We already have a user with that email address.');
                                    updateUser(user, fbUser.id).then(createAndSendToken).catch(next);
                                } else {
                                    // First time this Facebook user logs in (and we don't have a user with that email address)
                                    // Create a user
                                    winston.info('First time this Facebook user logs in');
                                    createUser(fbUser).then(createAndSendToken).catch(next);
                                }
                            })
                            .catch(next);
                    }
                })
                .catch(next);
        })
        .catch(next);
}

// Update a user with the Facebook user id.
function updateUser(user, fbUserId) {
    winston.info("Updating user " + user.id + " with FB id " + fbUserId);
    var externalUserId = (+new Date()).toString(36); // TODO: more robust UID logic
    return db.query(
        'UPDATE salesforce.contact SET fbUserId__c=$1, loyaltyid__c=$2 WHERE id=$3 RETURNING id, firstName, lastName, email, loyaltyid__c as externalUserId',
        [fbUserId, externalUserId, user.id], true);
}

// Create a user based on a Facebook user
function createUser(fbUser) {
    winston.info("Creating user: " + JSON.stringify(fbUser));
    var externalUserId = (+new Date()).toString(36); // TODO: more robust UID logic
    var pictureURL = 'https://graph.facebook.com/' + fbUser.id + '/picture?width=140&height=140';
    return db.query(
        'INSERT INTO salesforce.contact (email, firstname, lastname, leadsource, fbUserId__c, gender__c, pictureURL__c, loyaltyid__c, accountid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, firstName, lastName, email, gender__c as gender, pictureURL__c as pictureURL, loyaltyid__c as externalUserId',
        [fbUser.email, fbUser.first_name, fbUser.last_name, 'Loyalty App', fbUser.id, fbUser.gender, pictureURL, externalUserId, config.contactsAccountId], true);
}

// For security, ping the Facebook server to check that the Facebook token (1) is valid and (2) matches the Facebook User Id.
function validateFacebookToken(fbToken, fbUserId) {

    winston.info("Validating Facebook token: " + fbToken + " userId: " + fbUserId);

    var deferred = Q.defer(),
        url = 'https://graph.facebook.com/me?fields=id&access_token=' + fbToken;

    https.get(url,function (res) {

        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var data = JSON.parse(body);
            winston.info("Facebook response: " + body);
            if (data && data.id && data.id === fbUserId) {
                winston.info("Facebook token validated");
                deferred.resolve();
            } else {
                winston.error("Error validating Facebook Token: " + body);
                deferred.reject();
            }
        });

    }).on('error', function (e) {
            winston.error("System error validating Facebook Token: " + e);
            deferred.reject(e);
        });

    return deferred.promise;

}

exports.login = login;
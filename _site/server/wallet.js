var db = require('./pghelper'),
    winston = require('winston');

/**
 * Add a new offer to the user's wallet
 * @param req
 * @param res
 * @param next
 */
function addItem(req, res, next) {
    var userId = req.userId,
        offerId = req.body.offerId; // the id in the postgres table

    console.log(JSON.stringify(req.body));

    db.query('SELECT offerId FROM wallet WHERE userId=$1 AND offerId=$2', [userId, offerId], true)
        .then(function(offer) {
            if (offer) {
                return res.send(400, 'This offer is already in your wallet');
            }
            db.query('INSERT INTO wallet (userId, offerId) VALUES ($1, $2)', [userId, offerId], true)
                .then(function () {
                    return res.send('ok');
                })
                .fail(function(err) {
                    return next(err);
                });
        })
        .catch(next);
}

/**
 * Delete a offer from the user's wallet
 * @param req
 * @param res
 * @param next
 */
function deleteItem(req, res, next) {
    var userId = req.userId,
        offerId = req.params.id;
    db.query('DELETE FROM wallet WHERE userId=$1 AND offerId=$2', [userId, offerId], true)
        .then(function () {
            return res.send('OK');
        })
        .catch(next);
}

/**
 * Delete all wallet items for the given user
 * @param userId
 * @returns {*}
 */
function deleteItems(userId) {
    console.log('deleting wallet items for user ' + userId);
    return db.query('DELETE FROM wallet WHERE userId=$1', [userId], true)
}

/**
 * Get the user's wallet
 * @param req
 * @param res
 * @param next
 */
function getItems(req, res, next) {
    var userId = req.userId;
    db.query("SELECT id, name, startDate, endDate, description, image__c AS image, campaignPage__c AS campaignPage, publishDate__c AS publishDate FROM wallet, salesforce.campaign WHERE offerId = id AND userId=$1 AND type='Offer' AND status='In Progress' ORDER BY publishDate DESC LIMIT $2",
            [userId, 20])
        .then(function (offers) {
            return res.send(JSON.stringify(offers));
        })
        .catch(next);
}

exports.addItem = addItem;
exports.deleteItem = deleteItem;
exports.getItems = getItems;
exports.deleteItems = deleteItems;
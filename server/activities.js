var db = require('./pghelper'),
    Q = require('q'),
    wallet = require('./wallet'),
    wishlist = require('./wishlist');

/**
 * Add activity
 * @param req
 * @param res
 * @param next
 */
function addItem(req, res, next) {
    var userId = req.externalUserId,
        activity = req.body;

    console.log('Adding activity: ' + JSON.stringify(activity));

    getPointBalance(userId)
        .then(function(result) {
            var balance = (result && result.points) ? result.points : 0;

            db.query('INSERT INTO salesforce.eitech__interaction__c (eitech__contact__r__loyaltyid__c, eitech__campaign__c, eitech__product__c, eitech__type__c, eitech__points__c, eitech__name__c, eitech__picture__c) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    [userId, activity.offerId, activity.productId, activity.type, activity.points, activity.name, activity.image], true)
                .then(function() {
                    res.send({originalBalance: balance, points: activity.points, newBalance: balance + activity.points, originalStatus: getStatus(balance), newStatus: getStatus(balance + activity.points)});
                })
                .catch(next);
        })
        .catch(next);

}

/**
 * Get user's recent activity
 * @param req
 * @param res
 * @param next
 */
function getItems(req, res, next) {

    var externalUserId = req.externalUserId;
    console.log('external user id:' + externalUserId);

    db.query("SELECT eitech__contact__r__loyaltyid__c AS userId, eitech__campaign__c AS campaign, eitech__type__c AS type, eitech__name__c as name, eitech__picture__c as picture, eitech__points__c as points, createdDate FROM salesforce.eitech__interaction__c WHERE eitech__contact__r__loyaltyid__c=$1 ORDER BY id DESC LIMIT 20", [externalUserId])
        .then(function (activities) {
            console.log(JSON.stringify(activities));
            return res.send(JSON.stringify(activities));
        })
        .catch(next);
};

/**
 * Delete all activities for logged in user. Used for demo purpose to reset activities and start demo with empty list.
 * Also deletes user's wallet and wish list for consistency.
 * @param req
 * @param res
 * @param next
 */
function deleteAll(req, res, next) {
    var externalUserId = req.externalUserId,
        userId = req.userId;

    Q.all([deleteItems(externalUserId), wallet.deleteItems(userId), wishlist.deleteItems(userId)])
        .then(function () {
            return res.send('ok');
        })
        .catch(next);
}

/**
 * Delete all activities for the given user
 * @param userId
 * @returns {*}
 */
function deleteItems(userId) {
    console.log('deleting activity items for user ' + userId);
    return db.query("DELETE FROM salesforce.eitech__interaction__c WHERE eitech__contact__r__loyaltyid__c=$1", [userId]);
}

/**
 * Get user's point balance
 * @param userId
 * @returns {*}
 */
function getPointBalance(userId) {
    return db.query('select sum(eitech__points__c) as points from salesforce.eitech__interaction__c where eitech__contact__r__loyaltyid__c=$1', [userId], true);
}

/**
 * Returns status level based on number of points
 * @param points
 * @returns {number}
 */
function getStatus(points) {
    if (points>9999) {
        return 3;
    } else if (points>4999) {
        return 2;
    } else {
        return 1;
    }
}

exports.getItems = getItems;
exports.addItem = addItem;
exports.getPointBalance = getPointBalance;
exports.getStatus = getStatus;
exports.deleteAll = deleteAll;
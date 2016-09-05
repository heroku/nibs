var db = require('./pghelper'),
    activities = require('./activities'),
    winston = require('winston');

/**
 * Get user profile
 * @param req
 * @param res
 * @param next
 */
function getProfile(req, res, next) {
    var userId = req.userId,
        externalUserId = req.externalUserId;

    activities.getPointBalance(externalUserId)
        .then(function (activity) {
            db.query(
                    'SELECT id, firstName, lastName, email, mobilePhone, eitech__pictureURL__c as pictureURL, createddate, eitech__preference__c AS preference, eitech__size__c AS size, eitech__TypeCompte__c AS typeCompte FROM salesforce.contact WHERE id=$1',
                    [userId], true)
                .then(function (user) {
                    user.points = activity.points;
                    user.status = activities.getStatus(activity.points);
                    res.send(JSON.stringify(user));
                })
                .catch(next);
        })
        .catch(next);
}

/**
 * Update user profile
 * @param req
 * @param res
 * @param next
 */
function updateProfile(req, res, next) {

    var user = req.body,
        userId = req.userId;

    console.log('updating: ' + JSON.stringify(user));

    db.query('update salesforce.contact SET firstName=$1, lastName=$2, mobilePhone=$3, eitech__pictureURL__c=$4, eitech__preference__c=$5, eitech__size__c=$6 WHERE id=$7',
            [user.firstname, user.lastname, user.mobilephone, user.pictureurl, user.preference, user.size, userId])
        .then(function () {
            res.send(user);
        })
        .catch(next);
};

exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
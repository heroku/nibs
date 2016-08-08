var db = require('./pghelper'),
    winston = require('winston'),
	coupons = require('./coupons');

/**
 * Add a new offer to the user's wallet
 * @param req
 * @param res
 * @param next
 */
function addItem(req, res, next) {
    var userId = req.userId,
		externalId = req.externalUserId,
        offerId = req.body.offerId; // the id in the postgres table

    console.log(JSON.stringify(req.body));

    db.query('SELECT offerId FROM wallet WHERE userId=$1 AND offerId=$2', [userId, offerId], true)
        .then(function(offer) {
            if (offer) {
                return res.send(400, 'This offer is already in your wallet');
            }
            db.query('INSERT INTO wallet (userId, offerId) VALUES ($1, $2)', [userId, offerId], true)
				.then(function() {
					coupons.createCoupon({offerId: offerId, consommateur: externalId});
				})
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
    var userId = req.userId,
		externalId = req.externalUserId;
	db.query("SELECT campaign.id as id, campaign.name as name, campaign.startDate as startDate, campaign.endDate as endDate, campaign.description as description, campaign.eitech__image__c AS image, campaign.eitech__campaignPage__c AS campaignPage, campaign.eitech__publishDate__c AS publishDate, coupon.id as coupon_id, coupon.secret as secret FROM wallet, salesforce.campaign campaign, salesforce.eitech__coupon__c coupon WHERE wallet.offerId = campaign.id AND wallet.userId=$1 AND campaign.type='Offer' AND campaign.status='In Progress' and coupon.eitech__campaign__c = campaign.sfid and coupon.eitech__commercant__r__eitech__loyaltyid__c = $2  and coupon.date is null ORDER BY publishDate DESC LIMIT $3",
            [userId, externalId, 20])
        .then(function (offers) {
			for (offer in offers) {
				var coupon = {id: offer.coupon_id, secret: offer.secret, date: null};
				coupon.base64 = coupons.getImage(coupon);
				offer.coupon = coupon;
				delete offer.coupon_id;
				delete offer.secret;
			}
            return res.send(JSON.stringify(offers));
        })
        .catch(next);
}

exports.addItem = addItem;
exports.deleteItem = deleteItem;
exports.getItems = getItems;
exports.deleteItems = deleteItems;
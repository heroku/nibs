var db = require('./pghelper'),
    winston = require('winston');


/**
 * Add activity
 * @param req
 * @param res
 * @param next
 */
function addItem(req, res, next) {
    var userId = req.externalUserId,
        coupon = req.body;
    coupon.consommateur = userId;

    winston.info('Adding coupon: ' + JSON.stringify(coupon));

    getCoupon(coupon).then(function (coupons) {
        if (coupons.length > 0) {
            coupons[0].created = false;
            res.send(JSON.stringify(coupons[0]));
        } else {
            coupon.created = true;
            db.query('SELECT sfid FROM salesforce.contact where loyaltyid__c = $1', [userId]).then(function (sfid) {
                db.query('INSERT INTO salesforce.eitech__coupon__c(eitech__campaign__c, eitech__consommateur__c, eitech__consoloyaltyid_del__c) VALUES ($1, $2, $3) ', [coupon.offerId, sfid, userId]).then(function () {
                    res.send(JSON.stringify(coupon));
                });
            });

        }
    }).catch(next);

}


function getCoupon(coupon) {
    return db.query('select eitech__campaign__c as campaign, eitech__consoloyaltyid_del__c as consommateur, eitech__date_de_consommation__c as date, eitech__commercant__c as commercant from salesforce.eitech__coupon__c where  eitech__campaign__c as campaign=$1 and eitech__consommateur__c as  eitech__consoloyaltyid_del__c =$2', [coupon.offerId, coupon.userId]);
}

exports.addItem = addItem;
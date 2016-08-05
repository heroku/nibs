var db = require('./pghelper'),
    winston = require('winston');

function getCoupon(coupon) {
    "use strict";
    return db.query('select id, eitech__campaign__c as campaign, eitech__consommateur__r__eitech__loyaltyid__c as consommateur, eitech__date_de_consommation__c as date, eitech__commercant__r__eitech__loyaltyid__c as commercant from salesforce.eitech__coupon__c where  eitech__campaign__c=$1 and eitech__consommateur__r__eitech__loyaltyid__c=$2', [coupon.offerId, coupon.consommateur]);
}

/**
 * Add activity
 * @param req
 * @param res
 * @param next
 */
function addItem(req, res, next) {
    "use strict";
    var userId = req.externalUserId,
        coupon = req.body;
    coupon.consommateur = userId;

    winston.info('Adding coupon: ' + JSON.stringify(coupon));

    getCoupon(coupon).then(function (coupons) {
        winston.info("Coupons: " + JSON.stringify(coupons));
        if (coupons.length > 0) {
            coupons[0].created = false;
            res.send(JSON.stringify(coupons[0]));
        } else {
            coupon.created = true;
            
            db.query('INSERT INTO salesforce.eitech__coupon__c(eitech__campaign__c, eitech__consommateur__r__eitech__loyaltyid__c) VALUES ($1, $2) ', [coupon.offerId,  userId]).then(function () {
                res.send(JSON.stringify(getCoupon(coupon)));
            });
            

        }
    }).catch(next);

}




exports.addItem = addItem;
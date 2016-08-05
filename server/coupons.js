var db = require('./pghelper'),
    winston = require('winston');

function getCoupon(coupon) {
    return db.query('select id, eitech__campaign__c as campaign, eitech__consommateur__r__eitech__loyaltyid__c as consommateur, eitech__date_de_consommation__c as date, eitech__commercant__r__eitech__loyaltyid__c as commercant from salesforce.eitech__coupon__c where  eitech__campaign__c=$1 and eitech__consommateur__r__eitech__loyaltyid__c=$2', [coupon.offerId, coupon.consommateur]);
}

function findById(id, userId) {	
	return db.query('select id, eitech__campaign__c as campaign, eitech__consommateur__r__eitech__loyaltyid__c as consommateur, eitech__date_de_consommation__c as date, eitech__commercant__r__eitech__loyaltyid__c as commercant from salesforce.eitech__coupon__c where id = $1 and eitech__consommateur__r__eitech__loyaltyid__c = $2', [id, userId]);
}

/**
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
        winston.info("Coupons: " + JSON.stringify(coupons));
        if (coupons.length > 0) {
			var existingCoupon = coupons[0];

            res.send(JSON.stringify({id: coupons[0].id}));
        } else {
            
            db.query('INSERT INTO salesforce.eitech__coupon__c(eitech__campaign__c, eitech__consommateur__r__eitech__loyaltyid__c) VALUES ($1, $2) RETURNING id, eitech__campaign__c as campaign, eitech__consommateur__r__eitech__loyaltyid__c as consommateur', [coupon.offerId,  userId]).then(function (insertedCoupon) {
				winston.info("Inserted coupon: " + JSON.stringify(insertedCoupon));
                res.send(JSON.stringify({id: insertedCoupon.id}));
            });
            

        }
    }).catch(next);

}


function getById(req, res, next) {
	var id = req.params.id;
	var userId = req.externalUserId;
	findById(id, userId)
		.then(function (coupon) {
		console.log(JSON.stringify(coupon));
		return res.send(JSON.stringify(coupon));
	})
		.catch(next);
}



exports.addItem = addItem;
exports.getById = getById;
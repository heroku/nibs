var db = require('./pghelper'),
    winston = require('winston'),
    qrCode = require('qrcode-npm');

function getCoupon(coupon) {
    return db.query('select id, eitech__campaign__c as campaign, eitech__consommateur__r__eitech__loyaltyid__c as consommateur, eitech__date_de_consommation__c as date, eitech__commercant__r__eitech__loyaltyid__c as commercant from salesforce.eitech__coupon__c where  eitech__campaign__c=$1 and eitech__consommateur__r__eitech__loyaltyid__c=$2', [coupon.offerId, coupon.consommateur]);
}

function findById(id, userId) {	
	return db.query('select id, eitech__campaign__c as campaign, eitech__consommateur__r__eitech__loyaltyid__c as consommateur, eitech__date_de_consommation__c as date, eitech__commercant__r__eitech__loyaltyid__c as commercant, eitech__Secret__c as secret from salesforce.eitech__coupon__c where id = $1 and eitech__consommateur__r__eitech__loyaltyid__c = $2', [id, userId], true);
}


function createCoupon(coupon) {
	
	return getCoupon(coupon).then(function (coupons) {

		var retVal;
		if (coupons.length > 0) {
			var existingCoupon = coupons[0];
			
			retVal = coupons[0].id;
		} else {
			 retVal = db.query('INSERT INTO salesforce.eitech__coupon__c(eitech__campaign__c, eitech__consommateur__r__eitech__loyaltyid__c, eitech__Secret__c) VALUES ($1, $2, floor(random() * 1E10)) RETURNING id, eitech__campaign__c as campaign, eitech__consommateur__r__eitech__loyaltyid__c as consommateur, eitech__Secret__c as secret', [coupon.offerId,  coupon.consommateur]).then(function (insertedCoupon) {
				winston.info("Inserted coupon: " + JSON.stringify(insertedCoupon));
				
				return insertedCoupon[0].id;
				
			});

		}
		return retVal;
	});
	
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

//	getCoupon(coupon).then(function (coupons) {
//		winston.info("Coupons: " + JSON.stringify(coupons) + " " + coupons.length);
//		if (coupons.length > 0) {
//			res.send(JSON.stringify({id: coupons[0].id}));
//		} else {
//
//			db.query('INSERT INTO salesforce.eitech__coupon__c(eitech__campaign__c, eitech__consommateur__r__eitech__loyaltyid__c, eitech__Secret__c) VALUES ($1, $2, floor(random() * 1E10)) RETURNING id, eitech__campaign__c as campaign, eitech__consommateur__r__eitech__loyaltyid__c as consommateur, eitech__Secret__c as secret', [coupon.offerId,  userId]).then(function (insertedCoupon) {
//				winston.info("Inserted coupon: " + JSON.stringify(insertedCoupon));
//				res.send(JSON.stringify({id: insertedCoupon[0].id}));
//			});
//
//
//		}
//	}).catch(next);
	
	createCoupon(coupon).then(function(id) {
		res.send(JSON.stringify({id: id}))
	}).catch(next);
}

function getImage(coupon) {
	var qr = qrCode.qrcode(10, 'M');
	qr.addData(JSON.stringify({app: 'Heineken', id: coupon.id, secret: coupon.secret}));
	qr.make();
	
	return qr.createImgTag(4).match(/.*src="data:image\/gif;base64,([\w+/=]*)".*/)[1];
}

function getById(req, res, next) {
	var id = req.params.id;
	var userId = req.externalUserId;
	findById(id, userId)
		.then(function (coupon) {
        var text = JSON.stringify(coupon);
		console.log(text);
		if(coupon.date == null) {
			
			coupon.base64 = getImage(coupon);
		}
       
		return res.send(JSON.stringify(coupon));
	})
		.catch(next);
}



exports.addItem = addItem;
exports.getById = getById;
exports.createCoupon = createCoupon;
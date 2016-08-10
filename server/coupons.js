var db = require('./pghelper'),
winston = require('winston'),
qrCode = require('qrcode-npm');

const APP_NAME = 'Heineken';

function getCoupon(coupon) {
  return db.query('SELECT id, eitech__campaign__c as campaign, eitech__consommateur__r__eitech__loyaltyid__c as consommateur, eitech__date_de_consommation__c as date, eitech__commercant__r__eitech__loyaltyid__c as commercant FROM salesforce.eitech__coupon__c WHERE  eitech__campaign__c=$1 AND eitech__consommateur__r__eitech__loyaltyid__c=$2', [coupon.offerId, coupon.consommateur]);
}

function findById(id, userId) {
  return db.query('SELECT id, eitech__campaign__c as campaign, eitech__consommateur__r__eitech__loyaltyid__c as consommateur, eitech__date_de_consommation__c as date, eitech__commercant__r__eitech__loyaltyid__c as commercant, eitech__Secret__c as secret FROM salesforce.eitech__coupon__c WHERE id = $1 AND eitech__consommateur__r__eitech__loyaltyid__c = $2', [id, userId], true);
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

  createCoupon(coupon).then(function(id) {
    res.send(JSON.stringify({id: id}))
  }).catch(next);
}

function getImage(coupon) {
  var qr = qrCode.qrcode(10, 'M');
  qr.addData(JSON.stringify({app: APP_NAME, id: coupon.id, secret: coupon.secret}));
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

function check(req, res, next) {
  var couponInfo = req.body;
  var result;
  if(couponInfo.app != APP_NAME) {
    result = {valid: false, cause: 'Not a Heineken coupon'};
    return res.send(JSON.stringify(result));
  }

  db.query('SELECT coupon.id, coupon.eitech__campaign__c as campaign, coupon.eitech__consommateur__r__eitech__loyaltyid__c as consommateur, coupon.eitech__date_de_consommation__c as date, coupon.eitech__commercant__r__eitech__loyaltyid__c as commercant, coupon.eitech__Secret__c as secret, campaignT.name as name, campaignT.description as description, campaignT.startdate, campaignT.enddate FROM salesforce.eitech__coupon__c coupon, salesforce.campaign campaignT WHERE coupon.id = $1 AND coupon.eitech__Secret__c = $2 AND coupon.eitech__campaign__c = campaignT.sfid', [couponInfo.id, couponInfo.secret]).then(function(coupons) {

    if(coupons.length == 0) {
      result = {valid: false, cause: 'Coupon not found.'};
      return res.send(JSON.stringify(result));
    }

    var coupon = coupons[0];

    if(coupon.startdate != null && Date.now() < coupon.startdate) {
      result = {valid: false, cause: 'Campaign not started yet.', name: coupon.name, startdate: coupon.startdate};
      return res.send(JSON.stringify(result));
    }
    if(coupon.enddate != null) {
      var expiredDate = new Date(coupon.enddate);
      expiredDate.setDate(expiredDate.getDate() + 1);
      if(Date.now() > expiredDate) {
        result = {valid: false, cause: 'Campaign ended.', name: coupon.name, enddate: coupon.enddate};
        return res.send(JSON.stringify(result));
      }
    }

    if(coupon.date != null) {
      result = {valid: false, cause: 'Coupon already used.', name: coupon.name};
      return res.send(JSON.stringify(result));
    }

    result = {valid: true, name: coupon.name, description: coupon.description};
    winston.info("sending: " + JSON.stringify(result));
    return res.send(JSON.stringify(result));
  }).catch(next);
}

function consume(req, res, next) {
  var coupon = req.body,
    userId = req.externalUserId;

  db.query('UPDATE salesforce.eitech__coupon__c SET eitech__commercant__r__eitech__loyaltyid__c = $3, eitech__date_de_consommation__c = now() WHERE id = $1 AND eitech__Secret__c = $2 AND eitech__date_de_consommation__c IS NULL', [coupon.id, coupon.secret, userId]).then (function (result) {
    winston.info(JSON.stringify(result));
    return res.send(200);
  }, function(err) {
    winston.error(JSON.stringify(err));
    return res.send(400);
  });

}


exports.addItem = addItem;
exports.getById = getById;
exports.createCoupon = createCoupon;
exports.getImage = getImage;
exports.check = check;
exports.consume = consume;

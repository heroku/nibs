var db = require('./pghelper'),
    winston = require('winston');


function findAll(req, res, next) {

    var externalUserId = req.externalUserId;

    db.query("SELECT id, Banner__c as banner, Message__c as message, banner_image_url__c as url, From__c as author, CreatedDate FROM salesforce.inbox__c WHERE Contact__LoyaltyId__c=$1 ORDER BY id DESC LIMIT 20", [externalUserId])
        .then(function (messages) {
            console.log(JSON.stringify(messages));
            return res.send(JSON.stringify(messages));
        })
        .catch(next);
};

function findById(req, res, next) {
    var messageId = req.params.id;
        externalUserId = req.externalUserId;

    db.query("SELECT id, Banner__c as banner, Message__c as message, banner_image_url__c as url, From__c as author, CreatedDate FROM salesforce.inbox__c WHERE Contact__LoyaltyId__c=$1 AND id=$2", [externalUserId, messageId], true)
        .then(function (message) {
            console.log(JSON.stringify(message));
            return res.send(JSON.stringify(message));
        })
        .catch(next);
};

function deleteItem(req, res, next) {
    var messageId = req.params.id;
    externalUserId = req.externalUserId;

    db.query('DELETE FROM salesforce.inbox__c WHERE Contact__LoyaltyId__c=$1 AND id=$2', [externalUserId, messageId], true)
        .then(function () {
            return res.send('OK');
        })
        .catch(next);
}

exports.findAll = findAll;
exports.findById = findById;
exports.deleteItem = deleteItem;

var db = require('./pghelper'),
    winston = require('winston');

/**
 * Get a list of stores
 * @param req
 * @param res
 * @param next
 */
function findAll(req, res, next) {
    db.query("SELECT id, name, eitech__location___latitude__s AS latitude, eitech__location___longitude__s AS longitude FROM salesforce.eitech__store__c ORDER BY lastmodifieddate DESC")
        .then(function (stores) {
            return res.send(JSON.stringify(stores));
        })
        .catch(next);
};

exports.findAll = findAll;

var db = require('./pghelper'),
    config = require('./config'),
    winston = require('winston');

function findAll(limit) {
    return db.query('SELECT id, name, description, image__c AS image, productPage__c AS productPage, publishDate__c AS publishDate FROM salesforce.product2 WHERE Family=$1 ORDER BY publishDate DESC LIMIT $2', [config.productFamily, limit]);
};

function findById(id) {
    return db.query('SELECT id, name, description, image__c AS image, productPage__c AS productPage, publishDate__c AS publishDate FROM salesforce.product2 WHERE id=$1', [id], true);
};

function getAll(req, res, next) {
    findAll(20)
        .then(function (products) {
            return res.send(JSON.stringify(products));
        })
        .catch(next);
};

function getById(req, res, next) {
    var id = req.params.id;
    findById(id)
        .then(function (product) {
            return res.send(JSON.stringify(product));
        })
        .catch(next);
};

exports.findAll = findAll;
exports.findById = findById;
exports.getAll = getAll;
exports.getById = getById;
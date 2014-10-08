var db = require('./pghelper'),
    winston = require('winston');

/**
 * Add a new picture to the gallery
 * @param req
 * @param res
 * @param next
 */
function addItem(req, res, next) {
    var userId = req.userId,
        url = req.body.url;

    console.log(JSON.stringify(req.body));

    db.query('INSERT INTO picture (userId, url) VALUES ($1, $2)', [userId, url], true)
        .then(function () {
            return res.send('ok');
        })
    .catch(next);
}

/**
 * Delete all the pictures for the given user
 * @param userId
 */
function deleteItems(req, res, next) {
    var userId = req.userId;
    db.query('DELETE FROM picture WHERE userId=$1', [userId], true)
        .then(function() {
            return res.send('ok');
        })
        .catch(next);
}

/**
 * Get the user's pictures
 * @param req
 * @param res
 * @param next
 */
function getItems(req, res, next) {
    var userId = req.userId;
    db.query("SELECT id, url, publishDate FROM picture WHERE userId=$1 ORDER BY publishDate DESC LIMIT 10",
        [userId])
        .then(function (pictures) {
            return res.send(JSON.stringify(pictures));
        })
        .catch(next);
}

exports.addItem = addItem;
exports.deleteItems = deleteItems;
exports.getItems = getItems;
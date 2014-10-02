var db = require('./pghelper'),
    apn = require('apn');

// Create a connection to the service using mostly default parameters.

var service = new apn.connection({ gateway:'gateway.sandbox.push.apple.com' });

service.on('connected', function() {
    console.log("Connected");
});

service.on('transmitted', function(notification, device) {
    console.log("Notification transmitted to:" + device.token.toString('hex'));
});

service.on('transmissionError', function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
});

service.on('error', function(error) {
    console.error(JSON.stringify(error));
});

service.on('timeout', function () {
    console.log("Connection Timeout");
});

service.on('disconnected', function() {
    console.log("Disconnected from APNS");
});

service.on('socketError', console.error);

exports.send = function(req, res, next) {

    var message = req.body.message,
        alias = req.body.alias,
        badge = req.body.badge;
    var tokens = [];

    db.query('SELECT token FROM device')
        .then(function(devices) {
            console.log('**************' + JSON.stringify(devices));
            var l = devices.length;
            for (var i=0; i<l; i++) {
                tokens.push(devices[i].token);
            }
            console.log(tokens);
            var note = new apn.notification();
            note.setAlertText(message);
            note.badge = badge;
            service.pushNotification(note, tokens);
            res.send('ok');
        })
        .catch(next);

};

exports.register = function(req, res, next) {

    var token = req.body.token,
        alias = req.body.alias;

    console.log('Registering device ' + token);

    db.query('SELECT alias FROM device WHERE TOKEN=$1', [token], true)
        .then(function(device) {
            if(device) {
                if (alias !== device.alias) {
                    db.query('UPDATE device SET alias=$1 WHERE token=$2', [alias, token])
                        .then(function() {
                            res.send('ok');
                        })
                        .catch(next);
                } else {
                    res.send('ok');
                }
            } else {
                db.query('INSERT INTO device (token, alias) VALUES ($1, $2)', [token, alias])
                    .then(function(obj) {
                        res.send('ok');
                    })
                    .catch(next);
            }
        })
        .catch(next);
};

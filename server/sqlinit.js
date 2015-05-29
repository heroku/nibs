var fs = require('fs'),
    path = require('path'),
    db = require('./pghelper');

var filePath = path.join(__dirname, '../init.sql');

fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        db.query(data)
            .then(function() {
                console.log('Postgres tables successfully initialized') ;
                console.log("Run 'npm run init_salesforce_schema' to create the saleforce schema if not using Heroku Connect");
            })
            .catch(function(error) {
                console.log('Error initializing Postgres tables initialized');
                console.log(error)
            })
    }

});

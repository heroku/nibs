// Create the 'salesforce' schema and load test data into it. Only
// use this script if you are running WITHOUT Heroku Connect.

var fs = require('fs'),
    path = require('path'),
    db = require('./pghelper');

var filePath = path.join(__dirname, '../init_salesforce_schema.sql');

fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        db.query(data)
            .then(function() {
                console.log("Loaded test data into 'salesforce' schema") ;
                db.close();
            })
            .catch(function(error) {
                console.log("Error loading 'salesforce' schema test data");
                console.log(error)
                db.close();
            })
    }

});

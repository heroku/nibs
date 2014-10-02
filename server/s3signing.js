var crypto = require('crypto'),
    config = require('./config'),
    winston = require('winston'),

    bucket = config.s3.bucket,
    awsKey = config.s3.awsKey,
    secret = config.s3.secret;

exports.sign = function(req, res, next) {

    winston.info('Signing S3 document');

    var fileName = req.body.fileName,
        expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();

    var policy =
    { "expiration": expiration,
        "conditions": [
            {"bucket": bucket},
            {"key": fileName},
            {"acl": 'public-read'},
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 524288000]
        ]};

    policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
    signature = crypto.createHmac('sha1', secret).update(policyBase64).digest('base64');
    var response = {bucket: bucket, awsKey: awsKey, policy: policyBase64, signature: signature};
    winston.info(response);
    res.send({bucket: bucket, awsKey: awsKey, policy: policyBase64, signature: signature});

}

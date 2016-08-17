var express = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    compression = require('compression'),
    http = require('http'),
    path = require('path'),
    winston = require('winston'),
    cron = require('node-cron'),
    sqlinit = require('./server/sqlinit'),

    // App modules
    offers = require('./server/offers'),
    products = require('./server/products'),
    users = require('./server/users'),
    wallet = require('./server/wallet'),
    wishlist = require('./server/wishlist'),
    stores = require('./server/stores'),
    pictures = require('./server/pictures'),
    auth = require('./server/auth'),
    facebook = require('./server/facebook'),
    s3signing = require('./server/s3signing'),
    activities = require('./server/activities'),
    coupons = require('./server/coupons'),
    notifications = require('./server/notifications'),
    app = express();

app.set('port', process.env.PORT || 5000);

app.use(compression());
app.use(bodyParser({
    uploadDir: __dirname + '/uploads',
    keepExtensions: true
}));
app.use(methodOverride());

app.use(express.static(path.join(__dirname, './client')));

app.use('/public/img', express.static(path.join(__dirname, './img')));

app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.send(500, err.message);
});

app.post('/login', addCorsHeaders, auth.login);
app.post('/logout', addCorsHeaders, auth.validateToken, auth.logout);
app.post('/signup', addCorsHeaders, auth.signup);
app.post('/fblogin', addCorsHeaders, facebook.login);

app.get('/users/me', addCorsHeaders, auth.validateToken, users.getProfile);
app.put('/users/me', addCorsHeaders, auth.validateToken, users.updateProfile);

app.get('/offers', addCorsHeaders, auth.validateToken, offers.getAll);
app.get('/offers/:id', addCorsHeaders, offers.getById);

app.get('/products', addCorsHeaders, auth.validateToken, products.getAll);
app.get('/products/:id', addCorsHeaders, auth.validateToken, products.getById);
app.get('/stores', addCorsHeaders, stores.findAll);

app.get('/wallet', addCorsHeaders, auth.validateToken, wallet.getItems);
app.post('/wallet', addCorsHeaders, auth.validateToken, wallet.addItem);
app.delete('/wallet/:id', addCorsHeaders, auth.validateToken, wallet.deleteItem);

app.get('/wishlist', addCorsHeaders, auth.validateToken, wishlist.getItems);
app.post('/wishlist', addCorsHeaders, auth.validateToken, wishlist.addItem);
app.delete('/wishlist/:id', addCorsHeaders, auth.validateToken, wishlist.deleteItem);

app.get('/pictures', addCorsHeaders, auth.validateToken, pictures.getItems);
app.post('/pictures', addCorsHeaders, auth.validateToken, pictures.addItem);
app.delete('/pictures', addCorsHeaders, auth.validateToken, pictures.deleteItems);

app.get('/activities', addCorsHeaders, auth.validateToken, activities.getItems);
app.post('/activities', addCorsHeaders, auth.validateToken, activities.addItem);
app.delete('/activities', addCorsHeaders, auth.validateToken, activities.deleteAll);

app.post('/coupons', addCorsHeaders, auth.validateToken, coupons.addItem);
app.get('/coupons/:id', addCorsHeaders, auth.validateToken, coupons.getById);
app.post('/coupons/check', addCorsHeaders, auth.validateToken, coupons.check);
app.post('/coupons/consume', addCorsHeaders, auth.validateToken, coupons.consume);
app.get('/report', addCorsHeaders, auth.validateToken, coupons.getReport);

app.get('/notifications/register/:token', addCorsHeaders, notifications.register);


app.post('/s3signing', addCorsHeaders, auth.validateToken, s3signing.sign);

app.options('*', addCorsHeaders, function(req, res) {
    res.send(200);
});

function addCorsHeaders(req, res, next) {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "x-requested-with, Content-Type, origin, authorization, accept, client-security-token",
        "Access-Control-Allow-Methods": "DELETE,GET,HEAD,PATCH,POST,PUT",
        "Content-Type": "text/plain",
        "Access-Control-Max-Age": "3600"
    });
    return next();
}

cron.schedule('*/2 * * * *', function(){
  notifications.sendNotifications();
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

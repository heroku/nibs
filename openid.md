---
layout: default
title: openid.js
---

```javascript
    
db = require('./pghelper');

// OpenID Connect

function authorize(req, res, next) {
	console.log("!!! REQUEST FOR AUTHORIZE");

	var packet = {
		code: req.userId,
		state: req.query['state']
	};

	console.log("Redirect to: ", req.query['redirect_uri']);
	res.redirect(req.query['redirect_uri'] + '?' + querystring.stringify(packet));
}

function token(req, res, next) {
	console.log("!!!!!! REQUEST FOR TOKEN ", req.body);
	var userId = req.body.code;

	packet = {
	   "access_token":userId,
	   "token_type":"Bearer",
	   "expires_in":3600,
	   "refresh_token":"sweet_refresh_token",
	   "id_token":"sweet_id_token"
	  }
	res.set('Content-Type', 'application/json');
	return res.send(JSON.stringify(packet));
}

function user(req, res, next) {
	console.log("!!!!!!!!!! USER REQUEST: ", req.body);
	console.log("!!!!!!!!!! USER QUERY: ", req.query);
	var userId = req.query.access_token;

    db.query('SELECT id, firstName, lastName, email FROM salesforce.contact WHERE id=$1', [userId], true)
        .then(function (user) {

		packet = {
			"sub": "" + userId,
			"name": user.firstname + " " + user.lastname,
			"preferred_username": user.firstname + user.lastname,
			"given_name" : user.firstname,
			"family_name" : user.lastname,
			"email" : user.email
		};

		res.set('Content-Type', 'application/json');
		return res.send(JSON.stringify(packet));

	}).catch(next);
}

exports.authorize = authorize;
exports.token = token;
exports.user = user;
```

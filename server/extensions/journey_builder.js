// Bind the following actions:
// '/ixn/activities/hello-world/save/' -> save_activity
// '/ixn/activities/hello-world/execute/' -> execute_activity

var db = require('./pghelper'),
    util = require( 'util' ),
    et = require('./et'),
    config = require('./config'),
    url = require('url');

/*

Admin creates journey in JB with In-app trigger and In-app survey custom activity.

  JB POST to Nibs-node /ixn/activities/hello-world/save/ (survey details)
      -> function save_activity
        db: insert jb_activities


User opts-in to email marketing in the client.
  client->server
  	 -> function trigger_journey
  	       POST user's email and the app name as 'originEventStart' to JB trigger endpoint
           ..JB journey starts...

	 <- JB POST to Nibs-node /ixn/activities/hello-world/execute/
	        -> function execute_activity  
	          db: query survey details from jb_activities based on activity_id
		      db: insert survey and email into pending_surveys

  client -> poll server for waiting survey...
     -> function load_survey
          db: find pending_survey. Mark 'shown' and return to client

  client shows survey

*/

var jbClientId = process.env.JB_CLIENT_ID;
var jbClientSecret = process.env.JB_CLIENT_SECRET;

// Invoked from the app to enroll the user in the JB journey. The 'triggerId' identifies
// the trigger that we want to fire, and we need to supply the "originEventStart" value which matches
// the journey we want to start. This allows our trigger to fire different journey's that
// use the same trigger based on matching that value.
function trigger_journey(req, res, next) {
	logit(req);

	db.query('select email from salesforce.contact where id = $1', [req.userId], true)
		.then(function(user) {
			if (!user) {
				throw "User not found with salesforce.contact.id = " + req.userId;
			}
			domain = req.headers['host'].split(".")[0];

	        var data = {
                ContactKey: user.email,
                EventDefinitionKey: req.triggerId || config.JB_TRIGGER_ID,
                Data: {alternativeEmail:user.email, originEventStart: domain}
            };

		    et.push(config.JB_EVENT_API, data, true,
		        function() {
					res.send( 200, 'trigger_journey' );
		        },
		        function() {
		            next();
		        },
		        jbClientId,
		        jbClientSecret);
		}).catch(next);
}

// If the user has a pending survey from a JB custom activity, then return it.
function load_survey(req, res, next) {
	db.query('select email from salesforce.contact where id = $1', [req.userId], true, true)
		.then(function(user) {
			if (!user) {
				throw "User not found with id " + req.userId;
			}
			db.query('select * from pending_surveys where email = $1 and was_shown = false', [user.email], true, true)
				.then(function(survey) {
					if (survey) {
						res.json(200, survey.survey);
						db.query('UPDATE pending_surveys set was_shown = true where id = $1', [survey.id]);
					} else {
						res.send(200, 'false');
					}
				})
		})
		.catch(next);
}

// POST from Journey Builder to save a configured custom activity. The key is the
// 'activityObjectID' in the body, and the survey parameters are:
// q1_tag, q1_text, q1_choices, q2_tag, q2_text, q2_choices

function save_activity(req, res, next) {
	logit(req);

	var p = req.body;
	db.query("DELETE FROM jb_activities WHERE activity_id = $1", [p.activityObjectID])
		.then(function() {
			// We just jam the whole request into the 'survey' json column
			db.query('INSERT INTO jb_activities (activity_id, survey) VALUES ($1, $2)', 
				[p.activityObjectID, p], true)
		        .then(function () {
		            return res.send('save_activity');
		        });

		})
    	.catch(next);
}

// POST from JB journey to active our custom activity. 
// activityObjectID - id of the stored activity configuration
// keyValue - email of the user
// 
// We should alert the app to show the survey to the user
function execute_activity(req, res, next) {
	logit(req);
	var p = req.body;
	var act_id = p.activityObjectID;

	var domain = req.headers['host'].split(".")[0];
	if (req.body.inArguments) {
		if (req.body.inArguments[0] != domain) {
			console.log("IGNORING execute_activity sent to another domain: ", req.body.inArguments);
			console.log("My domain is: ", domain);
			res.send(200, "OK");
			return;
		}
	}

	if (!p.keyValue) {
		throw "Error in execute_activity, request doesn't include 'keyValue' which must contain the email address";
	}
	db.query('SELECT survey from jb_activities WHERE activity_id = $1', [act_id], true)
		.then(function(activity) {
			if (!activity) {
				throw "Unknown activity by id " + act_id;
			}
			db.query('INSERT into pending_surveys (email, survey) values ($1, $2)',
						[p.keyValue, activity.survey], true)
				.then(function() {
					res.send( 200, 'execute_activity' );
				})
		        .catch(function(err) {
		            res.send(500, err + '');
		        });
		})
		.catch(next);
}

function logit(req) {
    console.log( "body: " + util.inspect( req.body ) );
    console.log( "headers: " + req.headers );
    console.log( "trailers: " + req.trailers );
    console.log( "method: " + req.method );
    console.log( "url: " + req.url );
    console.log( "params: " + util.inspect( req.params ) );
    console.log( "query: " + util.inspect( req.query ) );
    console.log( "route: " + req.route );
    console.log( "cookies: " + req.cookies );
    console.log( "ip: " + req.ip );
    console.log( "path: " + req.path );
    console.log( "host: " + req.host );
    console.log( "fresh: " + req.fresh );
    console.log( "stale: " + req.stale );
    console.log( "protocol: " + req.protocol );
    console.log( "secure: " + req.secure );
    console.log( "originalUrl: " + req.originalUrl );
}


exports.trigger_journey = trigger_journey;
exports.load_survey = load_survey;
exports.save_activity = save_activity;
exports.execute_activity = execute_activity;

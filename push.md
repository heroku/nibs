---
layout: module
title: Push Notification
---

Push Notification is implemented using the ExactTarget Push APIs and Cordova Plugin.

## Use Case 1: Social Sharing (consumer-to-consumer)

In the Nibs mobile app, when a consumer shares an Offer or a Product on Facebook, Nibs pushes a message (currently to all Nibs users, but it could be to friends only in a real life app):

![alt tag](https://github.com/ccoenraets/nibs/raw/master/resources/screenshots/push_facebook.png)

![alt tag](https://github.com/ccoenraets/nibs/raw/master/resources/screenshots/push_facebook_notification.png)

> Tapping the notification opens the Nibs app on the related Product or Offer.

## Use Case 2: Pushing Exclusive Offers (business-to-consumers)

A "Push Offer" Publisher Action has been added to the Offer object (available in the Salesforce browser app or Salesforce1 app). When you select that action, a "Push Offer" page appears with a default message "Exclusive Offer: [offer name]", that you can customize before sending.

<strong>Publisher Action in the browser:</strong>

![alt tag](https://github.com/ccoenraets/nibs/raw/master/resources/screenshots/push_offer.png)

<strong>Publisher Action in S1 App:</strong>

![alt tag](https://github.com/ccoenraets/nibs/raw/master/resources/screenshots/push_offer_s1.png)


![alt tag](https://github.com/ccoenraets/nibs/raw/master/resources/screenshots/push_offer_notification.png)

> Tapping the notification opens the app on the related offer.

## Use Case 3: Ad Hoc Messages

The Loyalty app in Salesforce has a <strong>Push Notification</strong> tab that loads the PushAdmin Visualforce page (available in the Salesforce browser app or Salesforce1 app). You can use this page to push adhoc messages to all users, or to a group of users identified by their subscriber key (email address). 

<strong>PushAdmin in the Browser:</strong>

![alt tag](https://github.com/ccoenraets/nibs/raw/master/resources/screenshots/push_adhoc.png)

<strong>Push Admin in S1 App:</strong>

![alt tag](https://github.com/ccoenraets/nibs/raw/master/resources/screenshots/push_adhoc_s1.PNG)


![alt tag](https://github.com/ccoenraets/nibs/raw/master/resources/screenshots/push_adhoc_notification.png)


## Push Notification Analytics

Push Messages analytics can be tracked in the ET dashboard:

![alt tag](https://github.com/ccoenraets/nibs/raw/master/resources/screenshots/push_etdash.png)

## Code examples

#### Registering for notifications

The ExactTarget Mobile Push SDK works for both native and Hybrid apps. Here is a code example to register for notification in a hybrid app:

    ```
    ETPush.registerForNotifications(
        function() {
            console.log('registerForNotifications: success');
        },
        function(error) {
            console.log('registerForNotifications: error - ' + JSON.stringify(error));
        },
        "onNotification" // Function name as a string. The function to invoke when a message comes in.
    );
    
    ETPush.resetBadgeCount();
    
    // Associate a subscriber alias with the token
    if (user && user.email) {
        console.log('Subscribing for Push as ' + user.email);
        ETPush.setSubscriberKey(
            function() {
                console.log('setSubscriberKey: success');
            },
            function(error) {
                console.log('Error setting Push Notification subscriber');
            },
            user.email
        );
    }
    ```

#### Pushing Messages

To push a message, simply invoke the ExactTarget REST API. For example:

    ``` 
    var request = require('request'),
    
        config = require('./config'),
    
        accessTokens = {},
    
        authURL = 'https://auth.exacttargetapis.com/v1/requestToken',
    
        apiURL = 'https://www.exacttargetapis.com/push/v1';
    
    function requestToken(successHandler, errorHandler, clientId, clientSecret) {
    
        console.log('Requesting token for clientId ', clientId);
    
        request({ url: authURL,
                method: "POST",
                json: {'clientId': clientId, 'clientSecret': clientSecret}},
            function(error, response, body) {
                console.log(body);
                if (error) {
                    console.log(error);
                    if (errorHandler) errorHandler();
                } else {
                    accessTokens[clientId] = body.accessToken;
                    console.log('Got token: ' + accessTokens[clientId]);
                    if (successHandler) successHandler();
                }
    
            });
    }
    
    function push(url, data, retry, successHandler, errorHandler, clientId, clientSecret) {
        if (!clientId) {
            clientId = config.et.client_id;
        }
        if (!clientSecret) {
            clientSecret = config.et.client_secret;
        }
    
        function refreshTokenAndRetry() {
            console.log('refreshTokenAndRetry retry: ' + retry);
            if (retry) {
                requestToken(
                    function () {
                        push(url, data, false, successHandler, errorHandler, clientId, clientSecret);
                    },
                    function () {
                        return errorHandler();
                    },
                    clientId,
                    clientSecret
                );
            } else {
                return errorHandler();
            }
        }
    
        if (accessTokens[clientId]) {
            console.log('Using Access Token: ' + accessTokens[clientId]);
            request({ url: url,
                    method: "POST",
                    headers: {'Authorization': 'Bearer ' + accessTokens[clientId]},
                    json: data},
                function (error, response, body) {
                    if (error) {
                        console.log(error);
                        return errorHandler();
                    }
                    console.log(body);
                    if (body.message === 'Not Authorized') {
                        refreshTokenAndRetry();
                    } else {
                        return successHandler();
                    }
                });
        } else {
            refreshTokenAndRetry();
        }
    }
    
    exports.pushNotification = function(req, res, next) {
    
        var url,
    
            data = {
                "override": true,
                "messageText": req.body.messageText,
                "openDirect": req.body.openDirect
            };
    
        if (req.body.subscriberKeys) {
            data.subscriberKeys = req.body.subscriberKeys
            url = apiURL + '/messageContact/' + req.body.messageId + '/send';
        } else {
            url = apiURL + '/messageApp/' + req.body.messageId + '/send';
        }
    
        push(url, data, true,
            function() {
                res.send('ok');
            },
            function() {
                next();
            });
    
    };
    
    exports.push = push;
    ``` 
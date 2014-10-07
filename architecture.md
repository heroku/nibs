---
layout: module
title: Architecture
---
![alt tag](https://github.com/ccoenraets/nibsapp/raw/master/resources/nibs-architecture.jpg)

## Client-Side

The client-side is a single page application built with:

- [AngularJS](https://angularjs.org/)
- [Ionic](http://ionicframework.com/)

## Server-Side

The server-side runs in Heroku and is built with:

- Node.js
- [Express](http://expressjs.com/)
- Postgres
- Heroku Connect

## Multi-Platform

- Nibs is a hybrid application packaged with [Apache Cordova](https://cordova.apache.org/), enabling easy distribution on the different app stores.
- The application runs on iOS, Android, Windows Phone, Blackberry, etc.

## User Management

- User can sign up and create an account in the application or login with Facebook.
- Nibs users are stored as Contacts in Salesforce.
- User passwords are hashed with bcrypt using a per-user salt.
- The application generates its own authorization tokens that the client passes in the header of every request.

## Facebook Integration

- Facebook integration is performed using [OpenFB](https://github.com/ccoenraets/OpenFB).
- In addition to login, Nibs gets the user's profile picture and email address from Facebook.
- If that email address is already assigned to a Contact in Salesforce, the two accounts are reconciled. If not, a new contact is created.
- The Facebook integration also allows users to share application content (offers and products) on their feed.

## Heroku Connect

Heroku Connect is used to synchronize data between Salesforce and a Postgres database running in Heroku.

Heroku Connect synchronizes the following Salesforce objects:

- Contact (Bidirectional sync)
- Campaign (SF to Heroku)
- Product2 (SF to Heroku)
- Interaction__c (Bidirectional sync)
- Store__c (SF to Heroku)

Using Heroku Connect, developers access Salesforce data directly in the Postgres database using SQL. Developers can access Salesforce data in any way they want (any query, any join, any grouping and aggregation).


## Push Notification with ExactTarget Fuel

Push Notification is implemented using the ExactTarget Push APIs and Cordova Plugin.
Push notification is documented on [this page](https://github.com/ccoenraets/nibsapp/wiki/Push-Notification)


## REST

- The server-side application exposes its own REST endpoints.
- The client application gets its data by invoking these REST services.

These are API calls to your own application (the Nibs server), and they don't count towards API limits.

## Camera Integration

- Profile picture: The user can change his/her profile picture by either taking a selfie on the device, or choosing an existing picture from the device camera roll.
- Instagram-like feature: The user can take pictures and share them with the community.

In both cases, images are uploaded to an S3 bucket.

## S3 integration

Profile, Product, Campaign, and social pictures are stored in S3.

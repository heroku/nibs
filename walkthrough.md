---
layout: module
title: Application Walthrough
---


## Sign Up and Login

- Users can sign up and create an account in the application or login with Facebook.
- User passwords are hashed with bcrypt using a per-user salt.
- The application generates its own authorization tokens that the client passes in the header of every request.

<div class="row" style="padding-top: 4px;">
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/home.png" width="320"/>
</div>
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/signup.png" width="320"/>
</div>
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/login.png" width="320"/>
</div>
</div>

## Profile and Preferences

- Nibs users are managed as Contacts in Salesforce.
- If the user logged in with Facebook, Nibs gets the user's profile picture and email address from Facebook. If that email address is already assigned to a Contact in Salesforce, the two accounts are reconciled. If not, a new Contact is created in Salesforce.
- Users can edit their profile and preferences. This information is saved in the user's corresponding Contact object.

<div class="row" style="padding-top: 4px;">
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/profile-level1.png" width="320"/>
</div>
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/edit-profile.png" width="320"/>
</div>
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/preferences.png" width="320"/>
</div>
</div>

## Products

- Products come from the Product2 object in Salesforce and are synchronized using Heroku Connect
- Users can add a product to their wish list or share products on social networks


<div class="row" style="padding-top: 4px;">
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/products.png" width="320"/>
</div>
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/product.png" width="320"/>
</div>
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/wishlist.png" width="320"/>
</div>
</div>

## Offers

- Offers come from the Campaign object in Salesforce and are synchronized using Heroku Connect
- Users can redeem an offer, add an offer to their wallet, or share offers on social networks

<div class="row" style="padding-top: 4px;">
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/offers.png" width="320"/>
</div>
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/offer.png" width="320"/>
</div>
</div>

When redeeming an offer, the user is presented with a QR code he/she can present in a store. Alternatively, the user can save the offer to his/her wallet to redeem it later.

<div class="row" style="padding-top: 4px;">
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/redeem.png" width="320"/>
</div>
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/wallet.png" width="320"/>
</div>
</div>

## Activity and Point System

In Nibs, you earn points for performing specific activities in the application: sharing products and campaigns on social networks, redeeming an offer, saving an offer to your wallet, saving a product to your wish list, etc.

The Recent Activity screen shows the activities you performed and the points you earned:

<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/activity.png" width="320"/>

When you earn enough points, your status gets upgraded to a higher level. The three status levels in Nibs are:

|Points              | Status      |
|--------------------|-------------|
| 0 to 4999          | Forastero   |
| 5000 to 9999       | Trinitario  |
| &gt;9999           | Criollo     |


Nibs notifies you in real time when your status gets upgraded. Also, the application color theme automatically changes to reflect your new status.

<div class="row" style="padding-top: 4px;">
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/upgrade-level2.png" width="320"/>
</div>
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/profile-level2.png" width="320"/>
</div>
</div>

<div class="row" style="padding-top: 4px;">
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/upgrade-level3.png" width="320"/>
</div>
<div class="col-lg-4">
<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/profile-level3.png" width="320"/>
</div>
</div>

For demo purpose, you can delete your activities in the application: go to the the side menu, select Recent Activity, select the Gear icon (upper right corner), and click 'Delete Activities'. That will set you back to the lowest level (Forastero). Then perform 5 activities in the app (share, redeem, or save) and you will see your status change including the color theme change.

## Store Locator

The store locator uses the Geolocation API to center the map on your current location. It also shows you the stores nearby. You can click a store in the store list to center the map on that store's location.

<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/store-locator.png" width="320"/>

## Photo Sharing

Nibs has an instagram-like feature that lets users to share pictures featuring Nibs products.

<img src="https://github.com/ccoenraets/nibsapp/raw/master/resources/screenshots/gallery.png" width="320"/>


## Push Notification

The Push notification use cases are documented on [this page](push.html)

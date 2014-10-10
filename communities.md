---
layout: module
title: Communities Setup
---

First, add [openid.js](openid.html) to your server folder in Nibs.

And now add this code to `server.js` to integrate the OpenID provider endpoints into the Node server:

```javascript

var openid = require('./server/openid');

app_openid = express.Router();
app_openid.get('/authorize', auth.validateToken, openid.authorize);
app_openid.post('/token', openid.token);
app_openid.get('/user', openid.user);

app.use('/openid', app_openid);
```

## Salesforce setup

Create a custom Open ID Connect-style Auth provider in Salesforce:

```
Field                 | Value                                         | 
----------------------|------------------------------------------------
Name                  | Nibs                                          |
URL Suffix            | RealNibs                                      |
Consumer Key          | NibsOauthKey                                  |
Consumer Secret       | NibsOauthSecret                               |
Authorize Endpoint    | http://<heroku app domain>/openid/authorize   |
Token Endpoint        | http://<heroku app domain>/openid/token       |
User Endpoint         | http://<heroku app domain>/openid/user        |
Send access token     | **off**                                       |
in header             |                                               |
Registration handler  | Generate one                                  |
```

and **Save**

## Configure Nibs to know your new SSO page

Set `SF_SSO` in the Nibs app config vars to the value of the `Single Signon Init Page` in Salesforce.

### Reg handler

Now edit the generated Registration Handler class and set its content to:

```java
global class AutocreatedRegHandler1404346974326 implements Auth.RegistrationHandler{
    global boolean canCreateUser(Auth.UserData data) {
        //TODO: Check whether we want to allow creation of a user with this data
        //Set<String> s = new Set<String>{'usernamea', 'usernameb', 'usernamec'};
        //if(s.contains(data.username)) {
            //return true;
        //}
        return true;
    }
    
    global User createUser(Id portalId, Auth.UserData data){
        if(!canCreateUser(data)) {
            //Returning null or throwing an exception fails the SSO flow
            return null;
        }
        //The user is authorized, so create their Salesforce user
        User u = new User();
        Profile p = [SELECT Id FROM profile WHERE name='Standard User'];
        //TODO: Customize the username. Also check that the username doesn't already exist and
        //possibly ensure there are enough org licenses to create a user. Must be 80 characters
        //or less.
        u.username = data.username + '@acme.com';
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        String alias = data.username;
        //Alias must be 8 characters or less
        if(alias.length() > 8) {
            alias = alias.substring(0, 8);
        }
        u.alias = alias;
        u.languagelocalekey = UserInfo.getLocale();
        u.localesidkey = UserInfo.getLocale();
        u.emailEncodingKey = 'UTF-8';
        u.timeZoneSidKey = 'America/Los_Angeles';
        u.mobilePhone = '510-708-4560';
        u.profileId = p.Id;
        
        return u;
    }
    
    global void updateUser(Id userId, Id portalId, Auth.UserData data){
        User u = new User(id=userId);
        //TODO: Customize the username. Must be 80 characters or less.
        //u.username = data.username + '@myorg.com';
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        update(u);
    }
}
```

## Visualforce Page

Create a new visualforce page named `NibsChatter`.

Make the content of the page the following:

```xml
<apex:page sidebar="false" showheader="false">
  
  <div style="padding-left:8px;height:460px;overflow-y:scroll">
    <chatter:newsfeed />
  </div>
  
</apex:page>
```
             
## Permissions

Now edit the Profile for **Standard User**, scroll down to **Enabled Visualforce Page Access** and enable the **NibsChatter** page.

# Test

Login to Nibs. Now in the same browser, go to the SSO login page (from the Auth Provider configuration). Make sure you can login automatically and then navigate to /apex/NibsChatter and make sure you can see that page.



---
layout: module
title: Setup
---

## Deploying to Heroku using the Heroku Button

You can deploy your own version of Nibs in seconds using the Heroku button below:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
  
## Deploying to Heroku using the Command Line

You can also deploy Nibs to Heroku using the command line:

1. Clone the repository

    ```
    git clone https://github.com/heroku/nibs
    ```

1. Create a Heroku application

    ```
    cd nibs
    heroku create
    ```
    
1. Install the Postgres plugin    

    ```
    heroku addons:add heroku-postgresql:dev
    ```

1. Deploy to Heroku

    ```
    git push heroku master
    ```

1. Open the application

    ```
    heroku open
    ```

## Installing a Local Version 

You can also install Nibs on your local machine:

1. Clone the repository

    ```
    git clone https://github.com/heroku/nibs
    ```

1. Install the server dependencies

    ```
    cd nibs
    npm install
    ```
    
1. Create a local database
    - Install and start [Postgres](http://www.postgresql.org/) on your local machine
    - Create a database called **nibs**
    - If your database is available using **postgres://@127.0.0.1:5432/nibs**, you have nothing else to do
    - If you use another database URL, either define a shell environment variable called **DATABASE_URL**, or modify **server/config.js** to provide your own default URL

1. Start the server    

    ```
    node server
    ```

1. Run the application. Open a browser and access the following URL:

    [http://localhost:5000](http://localhost:5000)


## Facebook Integration


## Building the Cordova Shell

Follow the instructions below to run the application as an app on your device:

1. Install Cordova:

    ```
    npm install -g cordova
    ```
    
    On a Mac, you may have to use sudo:
    
    ```
    sudo npm install -g cordova
    ```

1. Create the cordova application

    ```
    cordova create nibs-shell com.nibs.loyalty Nibs
    ```

1. Adjust the contents of the www folder

    Either copy the contents of nibs/client into nibs-shell/www or delete www folder in nibs-shell and create a symbolic link to nibs-shell/www. 
    
    For example, on a Mac:
    
    ```
    cd nibs-shell
    rm -rf www
    ln -s [path-to-nibs]/client www
    ```

1. Install the Cordova plugins

    Make sure you are in the **nibs-shell** directory and type:

    ```
    cordova plugins add org.apache.cordova.device
    cordova plugins add org.apache.cordova.console
    cordova plugins add org.apache.cordova.statusbar
    cordova plugins add org.apache.cordova.geolocation
    cordova plugins add org.apache.cordova.dialogs
    cordova plugins add org.apache.cordova.inappbrowser
    ```

3. Add a platform

    For example, to add the iOS platform, type:

    ```
    cordova platforms add ios
    ```
    
4. Build the project    

    For example, to build for the iOS platform, type:

    ```
    cordova build ios
    ```

5. Run the app in the emulator or on your device. For example, for iOS, open the project (platforms/ios/Nibs.xcodeproj) in Xcode and run it in the emulator or on your iOS device.
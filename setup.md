---
layout: module
title: Setup
---

## Using Heroku Button

You can deploy your own version of Nibs in seconds using the Heroku button below:
 
 
## Using the Command Line

As an alternative you can also use the command line:

1. Clone the repository

    ```
    git clone https://github.com/heroku/nibs
    cd nibs
    ```

1. Create a Heroku application

    ```
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

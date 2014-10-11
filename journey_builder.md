---
layout: module
title: Journey Builder Setup
---
## Add the Journey Builder endpoints to Nibs

Merge the [Journey Builder Hello World](https://github.com/ExactTarget/journey-builder-custom-hello-world) 
template into your Express app in Node. Make sure the Journey Builder endpoints match
the ones you defined when you created your app in Exact Target.

## Setup in ETMC

First you will need an ETMC account with Journey Builder enabled. 
You will also need an account at [code.exacttarget.com](http://code.exacttarget.com/).

Note that domain of your Nibs instance on Heroku, for example:

    nibs2.herokuapp.com

This is the base address for most of the endpoints in the Journey Builder config.

# Setup the app in code@ExactTarget

Login to [code.exacttarget.com](https://code.exacttarget.com) and select **Create New App**.

Choose a **Marketing Cloud** app.

## Setup Application Event Callbacks

Click **Edit**, and set these endpoints:

    Login URL: https://<nibs app>.herokuapp.com/login
    Logout URL: https://<nibs app>.herokuapp.com/logout
    Home URL: https://<nibs app>.herokuapp.com/

## Create custom trigger

Define a custom trigger you can use to start a journey based on an action taken in the Nibs app.

Click **Create a new Journey Builder Trigger**

Fill out the form as follows:

| field | value |
--------| -----------
| Name | In-app action |
| Key | jb-inapp-trigger-scottpersinger |
| Description | Journey trigger based on an in-app action |
| Endpoint URL | https://<nibs app>.herokuapp.com/ixn/triggers/hello-world |
| Help URL | https://<nibs app>.herokuapp.com/ixn/triggers/hello-world/help |
| Help Description | In-app action |
| Select a Category | Trigger |
| Public Extension | This application and other installed applications |

And now click **Save**

## Create custom activity

Click **Create a new Journey Builder Activity**

and complete the form as follows:

| field | value |
--------| -----------
| Name | In-app action |
| Key | jb-survey-scottpersinger |
| Description | Create simple survey for people to take inside their mobile app |
| Endpoint URL | https://<your nibs app>.herokuapp.com/ixn/activities/hello-world |
| Help URL | https://<your nibs app>.com/ixn/activities/hello-world/help |
| Help Description | Configure two survey questions with a question and set of answer choices. |
| Select a Category | Messaging |
| Public Extension | This application and other installed applications |

Click **Save**


## Setup the data extension for your trigger

Login to the marketing cloud: https://mc.exacttarget.com

Select *Data Analytics -> Contact Builder*

Click **Create an Attribute Group**. Enter the name *In-app Trigger*.

Now click **Link Data Extension**

Click *Data Extensions* from the right-side list and find and select the one named `jb inapp trigger scottpersinger`.

Now click `Contact Key` in the left list, and `alternativeEmail` in the right list. And now click **Save**. Go back to **Data Designer** and you should see your *In-app Trigger* attribute group linked off of **Contact** with its 3 attributes.

## Create your Journey

Now we're ready to open Journey Builder itself. Click **New Interaction**.

Enter a name for your journey, like 'In-app survey 1'.

Click **Select a Trigger**, and select the **In-app Trigger*, and click **Next**.

Now enter the key value `survey`. This value is indicated by the Nibs app when the user opts-in to take the survey. Now click **Save** and **Done**.

On the canvas, set the time interval to `minutes`.

Now drag an instance of our *Custom Activity* called **In-app Survey** to the canvas, to the *Immediately* column.

Click **Configure** on the activity.

Now enter the question text and answer choices for the two survey questions.

# Troubleshooting

* Can you find the user's email address on the support page?

    https://jbinteractions.exacttargetapps.com/utils/support.html#definitions/scott@heroku.com

* Is the email of the user in the All Subscribers list? If status page says "Failed" this indicates the email is missing.

* Is the user still 'in' the interaction? The 1 minute wait can sometimes take multiple minutes. Check the Activity Log on support page and make sure the last state isn't 'Waiting'.


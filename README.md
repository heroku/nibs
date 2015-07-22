## Nibs

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Check out the [documentation](http://heroku.github.io/nibs) to learn more about Nibs and to set up your own instance.

## Changes

Updated: 7/22/2015

    Modify product selection query to filter on the 'family' column - defaults to selecting products where 'family' is 'Nibs' - 
    this can be overridden by setting the PRODUCT_FAMILY config variable
    
Updated: 4/21/2015

    Split 'salesforce' schema sql init commands into a separate command. Run 'npm run init_salesforce_schema' now
    to intialize the database **without** Heroku Connect.
    

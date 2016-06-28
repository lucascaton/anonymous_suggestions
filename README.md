# Anonymous suggestions

App for register anonymous suggestions.

Built with **AngularJS**, **Express.js** (**Node.js**) and **MongoDB**!

## Setup

Check if you have node installed:

    node -v

Install the packages:

    npm install
    cd public && bower install

Run the server:

    npm start

## Heroku variables

heroku config

## Database

### How to clean the database?

In mongo console:

Development:

    use anonymous_suggestions
    db.suggestions.remove({});
    db.comments.remove({});

Production:

    use database_name

You can find out the database name through MONGOLAB_URI variable from `heroku config`.
This is the URL pattern: mongodb://username:password@host1:port1,host2:port2/database

    db.suggestions.remove({});
    db.comments.remove({});

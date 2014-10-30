# Anonymous suggestions

App for register anonymous suggestions.

Built with **AngularJS**, **Express.js** (**Node.js**) and **MongoDB**!

## Setup

Check if you have node 0.10+

    node -v

Install the packages:

    npm install
    bower install

Run the server:

    npm start

## Database

### How to clean the database?

In mongo console:

    use anonymous_suggestions
    db.suggestions.remove({});
    db.comments.remove({});

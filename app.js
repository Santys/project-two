// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// user session here:                 
require('./config/session.config')(app);

// default value for title local
const projectName = 'project-two';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = "MyBookApp";

// HBS helpers
hbs.registerHelper('isReviewed', function(id, array, options) {
    const stringsArray = array.map(x => x.toString());
    return stringsArray.includes(id) ? options.fn(this) : options.inverse(this);
})

//Middleware for user session
app.use((req, res, next) => {
    if (req.session.loggedUser) {
        res.locals.session = req.session
    }
    next()
});

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

app.use('/', require('./routes/auth'));

app.use('/books', require('./routes/searchBooks'));
app.use('/books', require('./routes/reviews'));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;


const express = require('express');
const http = require('http');
const path = require('path');

// Import contact controller
const contactsRouter = require('./controllers/contactController');

// Initialize an instance of Express
const app = express();

// Configure the views directory
app.set('views', path.join(__dirname, 'views'));

// Configure the assets directory for the Express application
app.use(express.static(path.join(__dirname, 'public')));

// Configure the view engine to use the Twig engine
app.set('view engine', 'twig');

// Add middleware to handle requests with JSON data
app.use(express.json());

// Add middleware to handle requests with URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Define contact router
app.use('/contacts', contactsRouter);

// Start serving static files from the /assets route
app.use('/assets', express.static(path.join(__dirname, 'public')));

// Start serving CSS files from the /css route
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));

// Create an HTTP server
const server = http.createServer(app);

// Make the server listen on port 3000 and log a message to the console once the server is started
server.listen(3000, () => {
  console.log("Server started!");
});

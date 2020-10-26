/*************************************************************
 *
 * Execution       : default node cmd> node server.js
 * Purpose         : Run a nodejs server and connect to a database server
 *
 * @description    : Creates a app using express ,and add two body-parser middlewares 
 *                   using express’s app.use() method. We connect to the database using mongoose.
 *                   We run a nodejs server which listens on port number 5000. 
 *                   
 *
 * @file           : server.js
 * @overview       : Run a nodejs server and connect to a database server
 * @module         : Fundoo_Notes
 * @version        : 1.0
 * @since          : 16/11/2020
 *
 * **********************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const logger = require('./config/logger');
require('./config/databaseConfig');
require('dotenv/config');
const clearCache = require('./middleware/redisCache');
const cors = require('cors');
const swaggerUi = require('swagger-ui');
var swaggerJSDoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');

// create express app
const app = express();

// swagger definition
var swaggerDefinition = {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:5000',
    basePath: '/',
};
  
// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
};
  
// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);
  
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());

app.use(routes);

// serve swagger
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerSpec);
});

//Define a simple route to display Message at the homepage
app.get('/', (req, res) => {
        res.json("Welcome to Fundoo Notes application.");
});

// listen for requests
const PORT = process.env.PORT;
app.listen( PORT, () => {
    logger.info( "Server is listening on port"+" " +PORT);
});
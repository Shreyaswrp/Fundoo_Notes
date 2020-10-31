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
require('./middleware/redisCache');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
 
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

app.use(cors());

app.use(routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Define a simple route to display Message at the homepage
app.get('/', (res) => {
        res.json("Welcome to Fundoo Notes application.");
});

// listen for requests
const PORT = process.env.PORT;
app.listen( PORT, () => {
    logger.info( "Server is listening on port"+" " +PORT);
});
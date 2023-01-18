require('dotenv').config({ path: 'src/dev.env' });
const express = require('express');
const app = express();

const userRoute = require('../router/user.route');

// Connect to DB
require('../config/db.config')

/** Middleware */

// Parse incoming JSON payloads
app.use(express.json());


// Routers
app.use('/user', userRoute);



module.exports = app;



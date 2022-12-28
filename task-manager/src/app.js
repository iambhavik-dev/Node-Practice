require('dotenv').config();
const express = require('express');


//  Run mongoose
require('./db/mongoose');

//  Import routers
const userRouter = require('./routers/user.router');
const taskRouter = require('./routers/task.router');

const app = express();

/** middleware */
// parse incoming JSON payloads
app.use(express.json())

// add routers
app.use('/users', userRouter);
app.use('/tasks', taskRouter);


// * Testing purpose
app.get("/test", (req, res) => {
    res.send('testing!!');
});

module.exports = app;
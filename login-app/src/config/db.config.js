const mongoose = require('mongoose')

mongoose.set('strictQuery', true);

mongoose.connect(process.env.DB_CONNECTION_STRING, {})
    .then(res => console.log('Connected to DB'))
    .catch(err => console.error(err));